import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';

// JWT verification for MongoDB Atlas tokens
function verifyToken(token: string) {
  // For now, accept tokens from MongoDB Atlas authentication
  if (token && (token.includes('admin') || token.startsWith('eyJ'))) {
    return { isAdmin: true, id: 'admin' };
  }
  return null;
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
      data: data.data,
      isDatabaseMode: true,
      source: 'MongoDB Atlas'
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
    }
  };

  return NextResponse.json({
    success: true,
    data: dashboardData,
    isDatabaseMode: false,
    source: 'Demo (MongoDB Atlas connection failed)',
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
