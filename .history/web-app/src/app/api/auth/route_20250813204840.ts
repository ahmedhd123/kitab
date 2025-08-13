import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, type, username, firstName, lastName, bio, favoriteGenres } = body;

    let endpoint = '';
    let payload = {};

    if (type === 'login') {
      endpoint = '/api/auth/login';
      payload = { email, password };
    } else if (type === 'register') {
      endpoint = '/api/auth/register';
      payload = { 
        email, 
        password, 
        username: username || email.split('@')[0], 
        firstName, 
        lastName, 
        bio,
        favoriteGenres 
      };
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'نوع العملية غير مدعوم' 
      }, { status: 400 });
    }

    console.log(`🔗 Connecting to MongoDB Atlas via: ${BACKEND_URL}${endpoint}`);

    // Call Railway backend (connected to MongoDB Atlas)
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://kitab-plum.vercel.app',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MongoDB Atlas connection error:', {
        status: response.status,
        message: data.message
      });
      
      // Fallback to demo mode only if MongoDB is completely unreachable
      if (response.status >= 500) {
        console.log('🔄 MongoDB Atlas unreachable, using demo fallback');
        return handleDemoFallback(body);
      }
      
      return NextResponse.json({
        success: false,
        message: data.message || 'خطأ في العملية',
        isDatabaseMode: false
      }, { status: response.status });
    }

    console.log('✅ MongoDB Atlas operation successful');
    return NextResponse.json({
      success: true,
      message: data.message,
      user: data.user,
      token: data.token,
      isDatabaseMode: true // Indicates real database usage
    });

  } catch (error) {
    console.error('MongoDB Atlas connection failed:', error);
    
    // Only use demo mode if network completely fails
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      console.log('🔄 Network error, using demo fallback');
      return handleDemoFallback(await request.json());
    }

    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الاتصال بقاعدة البيانات' 
    }, { status: 500 });
  }
}

// Demo fallback function (only for network failures)
function handleDemoFallback(body: any) {
  const { email, password, type } = body;
  
  if (type === 'login') {
    if (email === 'admin@kitabi.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'demo_admin',
          email: 'admin@kitabi.com',
          username: 'admin',
          profile: { firstName: 'مدير', lastName: 'النظام' },
          role: 'admin',
          isAdmin: true
        },
        token: 'demo_token_admin',
        isDatabaseMode: false,
        message: 'تم الدخول بالوضع التجريبي'
      });
    }
  }
  
  return NextResponse.json({
    success: false,
    message: 'فشل الاتصال بقاعدة البيانات'
  }, { status: 503 });
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
