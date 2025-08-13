import { NextRequest, NextResponse } from 'next/server';

// Simple JWT verification for demo
function verifyToken(token: string) {
  // In a real app, this would verify the JWT properly
  // For demo, we'll accept specific tokens
  if (token === 'demo_token_admin' || token.includes('admin')) {
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

    const user = verifyToken(token);
    if (!user || !user.isAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 });
    }

    // Return dashboard data
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
          title: 'New book "الأسود يليق بك" added',
          user: 'Admin',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          icon: 'book'
        },
        {
          id: '2',
          type: 'user_registered',
          title: 'New user registration: أحمد محمد',
          user: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          icon: 'user'
        },
        {
          id: '3',
          type: 'review_posted',
          title: 'New review for "مئة عام من العزلة"',
          user: 'فاطمة علي',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          icon: 'star'
        },
        {
          id: '4',
          type: 'book_downloaded',
          title: '50 downloads for "دعاء الكروان"',
          user: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          icon: 'download'
        }
      ],
      topBooks: [
        { id: '1', title: 'دعاء الكروان', author: 'طه حسين', downloads: 2341, rating: 4.9 },
        { id: '2', title: 'مدن الملح', author: 'عبد الرحمن منيف', downloads: 1987, rating: 4.8 },
        { id: '3', title: 'الأسود يليق بك', author: 'أحلام مستغانمي', downloads: 1654, rating: 4.7 },
        { id: '4', title: 'مئة عام من العزلة', author: 'غابرييل غارسيا ماركيز', downloads: 1432, rating: 4.6 }
      ],
      chartData: {
        downloads: [
          { month: 'يناير', count: 1200 },
          { month: 'فبراير', count: 1350 },
          { month: 'مارس', count: 1100 },
          { month: 'أبريل', count: 1450 },
          { month: 'مايو', count: 1600 },
          { month: 'يونيو', count: 1800 }
        ],
        users: [
          { month: 'يناير', count: 85 },
          { month: 'فبراير', count: 92 },
          { month: 'مارس', count: 78 },
          { month: 'أبريل', count: 105 },
          { month: 'مايو', count: 120 },
          { month: 'يونيو', count: 89 }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
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
