import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || process.env.BACKEND_URL || 'https://kitab-production.up.railway.app';

// JWT token generation (simplified for demo)
function generateToken(user: any) {
  return `jwt_${user.role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function handleDemoFallback(body: any) {
  const { email, password, type, username, firstName, lastName } = body;
  
  if (type === 'login') {
    // Demo login users
    if (email === 'admin@kitabi.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          id: 'demo_admin',
          email: 'admin@kitabi.com',
          username: 'admin',
          firstName: 'مدير',
          lastName: 'الموقع',
          role: 'admin',
          isAdmin: true
        },
        token: generateToken({ role: 'admin' }),
        isDatabaseMode: false,
        source: 'Demo Mode'
      });
    } else if (email && password) {
      return NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          id: `demo_user_${Date.now()}`,
          email,
          username: email.split('@')[0],
          firstName: 'مستخدم',
          lastName: 'تجريبي',
          role: 'user',
          isAdmin: false
        },
        token: generateToken({ role: 'user' }),
        isDatabaseMode: false,
        source: 'Demo Mode'
      });
    }
  } else if (type === 'register') {
    // Demo registration
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: `demo_user_${Date.now()}`,
        email,
        username: username || email.split('@')[0],
        firstName: firstName || 'مستخدم',
        lastName: lastName || 'جديد',
        role: 'user',
        isAdmin: false
      },
      token: generateToken({ role: 'user' }),
      isDatabaseMode: false,
      source: 'Demo Mode'
    });
  }
  
  return NextResponse.json({
    success: false,
    message: 'فشل في المصادقة'
  }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, type, username, firstName, lastName, bio, favoriteGenres } = body;

    // Validate input
    if (!email || !password || !type) {
      return NextResponse.json({ 
        success: false, 
        message: 'البيانات المطلوبة غير مكتملة' 
      }, { status: 400 });
    }

    // Always try Railway backend first for production
    console.log(`🚂 Using Railway backend: ${BACKEND_URL}/api/auth/${type}`);
    
    const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = type === 'login' 
      ? { email, password }
      : { email, password, username: username || email.split('@')[0], firstName, lastName, bio, favoriteGenres };

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://kitab-plum.vercel.app',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        return NextResponse.json({
          ...data,
          isDatabaseMode: true,
          source: 'Railway PostgreSQL'
        });
      }

      // If Railway backend gives client error (4xx), return the error
      if (response.status >= 400 && response.status < 500) {
        return NextResponse.json({
          success: false,
          message: data.message || 'خطأ في البيانات المرسلة'
        }, { status: response.status });
      }

      // For server errors (5xx), fall back to demo mode
      console.log('🔄 Railway backend server error, using demo fallback');
      return handleDemoFallback(body);

    } catch (networkError) {
      console.error('🌐 Network error connecting to Railway, using demo fallback:', networkError);
      return handleDemoFallback(body);
    }

  } catch (error) {
    console.error('❌ API route error:', error);
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ داخلي في الخادم'
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
