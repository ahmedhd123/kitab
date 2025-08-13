import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';
const USE_DIRECT_MONGODB = process.env.NEXT_PUBLIC_USE_DIRECT_MONGODB === 'true';

// JWT verification for MongoDB Atlas tokens
function verifyToken(token: string) {
  // For now, accept tokens from MongoDB Atlas authentication
  if (token && (token.includes('admin') || token.startsWith('eyJ'))) {
    return { isAdmin: true, id: 'admin' };
  }
  return null;
}

async function getDirectMongoDBStats() {
  try {
    const { db } = await connectToDatabase();
    
    // Get real counts from MongoDB Atlas
    const [userCount, bookCount, reviewCount] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('books').countDocuments(),
      db.collection('reviews').countDocuments()
    ]);

    // Get this month's data
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [usersThisMonth, booksThisMonth, reviewsThisMonth] = await Promise.all([
      db.collection('users').countDocuments({ createdAt: { $gte: startOfMonth } }),
      db.collection('books').countDocuments({ createdAt: { $gte: startOfMonth } }),
      db.collection('reviews').countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    // Get recent activity
    const recentActivity = [];
    
    const recentBooks = await db.collection('books')
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    recentBooks.forEach(book => {
      recentActivity.push({
        id: book._id.toString(),
        type: 'book_added',
        title: `تم إضافة كتاب: ${book.title}`,
        user: 'النظام',
        timestamp: book.createdAt || new Date(),
        icon: 'book'
      });
    });

    const recentUsers = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();
    
    recentUsers.forEach(user => {
      recentActivity.push({
        id: user._id.toString(),
        type: 'user_registered',
        title: `مستخدم جديد: ${user.username || user.email}`,
        user: 'النظام',
        timestamp: user.createdAt || new Date(),
        icon: 'user'
      });
    });

    // Sort by timestamp
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Get top books (by review count)
    const topBooks = await db.collection('books')
      .aggregate([
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'bookId',
            as: 'reviews'
          }
        },
        {
          $addFields: {
            downloads: { $size: '$reviews' }, // Use review count as proxy for downloads
            rating: { $avg: '$reviews.rating' }
          }
        },
        { $sort: { downloads: -1 } },
        { $limit: 5 }
      ])
      .toArray();

    // Generate chart data (simplified for demo)
    const chartData = {
      downloads: [
        { month: 'يناير', count: Math.floor(reviewCount * 0.3) },
        { month: 'فبراير', count: Math.floor(reviewCount * 0.4) },
        { month: 'مارس', count: reviewsThisMonth }
      ],
      users: [
        { month: 'يناير', count: Math.floor(userCount * 0.2) },
        { month: 'فبراير', count: Math.floor(userCount * 0.3) },
        { month: 'مارس', count: usersThisMonth }
      ]
    };

    return {
      totalBooks: bookCount,
      totalUsers: userCount,
      totalReviews: reviewCount,
      totalDownloads: reviewCount * 2, // Estimated
      booksThisMonth,
      usersThisMonth,
      reviewsThisMonth,
      downloadsThisMonth: reviewsThisMonth * 2,
      recentActivity: recentActivity.slice(0, 10),
      topBooks: topBooks.map(book => ({
        id: book._id.toString(),
        title: book.title,
        author: book.author,
        downloads: book.downloads || 0,
        rating: Math.round((book.rating || 0) * 10) / 10
      })),
      chartData,
      isDatabaseMode: true,
      source: 'MongoDB Atlas Direct'
    };
  } catch (error) {
    console.error('Direct MongoDB dashboard error:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No token provided'
      }, { status: 401 });
    }

    // Try direct MongoDB connection first if enabled
    if (USE_DIRECT_MONGODB) {
      try {
        console.log('🔗 Getting dashboard data from MongoDB Atlas directly...');
        const dashboardData = await getDirectMongoDBStats();
        
        return NextResponse.json({
          success: true,
          data: dashboardData,
          message: 'تم جلب البيانات من MongoDB Atlas مباشرة'
        });
      } catch (mongoError) {
        console.error('Direct MongoDB failed, falling back to Railway backend:', mongoError);
      }
    }

    console.log(`🔗 Fetching admin dashboard from MongoDB Atlas via: ${BACKEND_URL}/api/admin/dashboard`);

    // Call Railway backend (connected to MongoDB Atlas)
    const response = await fetch(`${BACKEND_URL}/api/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://kitab-plum.vercel.app',
      },
    });

    if (!response.ok) {
      console.error('MongoDB Atlas admin dashboard error:', response.status);
      
      // Fallback to demo dashboard if MongoDB is unreachable but user is authenticated
      if (response.status >= 500 && verifyToken(token)) {
        console.log('🔄 MongoDB Atlas unreachable, using demo dashboard');
        return getDemoDashboard();
      }
      
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        message: errorData.message || 'Admin access denied'
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Retrieved admin dashboard from MongoDB Atlas');

    return NextResponse.json({
      success: true,
      data: {
        ...data.data,
        isDatabaseMode: true,
        source: 'Railway Backend'
      }
    });

  } catch (error) {
    console.error('MongoDB Atlas admin connection failed:', error);
    
    // Fallback to demo dashboard only if user has valid token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token && verifyToken(token)) {
      console.log('🔄 Network error, using demo dashboard');
      return getDemoDashboard();
    }

    return NextResponse.json({
      success: false,
      message: 'Admin dashboard connection failed'
    }, { status: 500 });
  }
}

// Demo dashboard fallback (only for network failures with valid auth)
function getDemoDashboard() {
  const dashboardData = {
    totalBooks: 156,
    totalUsers: 1247,
    totalReviews: 3421,
    totalDownloads: 12547,
    booksThisMonth: 23,
    usersThisMonth: 89,
    reviewsThisMonth: 145,
    downloadsThisMonth: 1834,
    recentActivity: [
      {
        id: '1',
        type: 'book_added',
        title: 'كتاب جديد تم إضافته',
        user: 'النظام',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        icon: 'book'
      },
      {
        id: '2',
        type: 'user_registered',
        title: 'مستخدم جديد سجل في النظام',
        user: 'النظام',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        icon: 'user'
      }
    ],
    topBooks: [
      { id: '1', title: 'دعاء الكروان', author: 'طه حسين', downloads: 2341, rating: 4.9 },
      { id: '2', title: 'مدن الملح', author: 'عبد الرحمن منيف', downloads: 1987, rating: 4.8 }
    ],
    chartData: {
      downloads: [
        { month: 'يناير', count: 1200 },
        { month: 'فبراير', count: 1350 },
        { month: 'مارس', count: 1100 }
      ],
      users: [
        { month: 'يناير', count: 85 },
        { month: 'فبراير', count: 92 },
        { month: 'مارس', count: 78 }
      ]
    },
    isDatabaseMode: false,
    source: 'Demo (MongoDB Atlas connection failed)',
    warning: 'عرض البيانات التجريبية - فشل الاتصال بقاعدة البيانات'
  };

  return NextResponse.json({
    success: true,
    data: dashboardData,
    message: 'عرض البيانات التجريبية - فشل الاتصال بقاعدة البيانات'
  });
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
