import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, type, username, firstName, lastName, bio, favoriteGenres } = body;

    let endpoint = '';
    let backendPayload = {};

    if (type === 'login') {
      endpoint = '/api/auth/login';
      backendPayload = { email, password };
    } else if (type === 'register') {
      endpoint = '/api/auth/register';
      backendPayload = { 
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

    // Call backend API
    const backendResponse = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
    });

    const backendData = await backendResponse.json();

    if (backendResponse.ok && backendData.success) {
      return NextResponse.json({
        success: true,
        message: backendData.message,
        user: backendData.user,
        token: backendData.token,
        isDatabaseMode: backendData.isDatabaseMode || false
      });
    } else {
      return NextResponse.json({
        success: false,
        message: backendData.message || 'خطأ في العملية'
      }, { status: backendResponse.status || 400 });
    }

  } catch (error) {
    console.error('Frontend API Error:', error);
    
    // Fallback to demo mode if backend is not available
    if (error.message?.includes('fetch')) {
      console.log('Backend not available, using demo mode');
      
      const { email, password, type } = await request.json();
      
      if (type === 'login') {
        if (email === 'admin@kitabi.com' && password === 'admin123') {
          return NextResponse.json({
            success: true,
            user: {
              id: 'demo_admin',
              email: 'admin@kitabi.com',
              username: 'admin',
              profile: {
                firstName: 'مدير',
                lastName: 'الموقع'
              },
              role: 'admin',
              isAdmin: true
            },
            token: 'demo_token_admin',
            isDatabaseMode: false
          });
        } else if (email && password) {
          return NextResponse.json({
            success: true,
            user: {
              id: 'demo_user',
              email: email,
              username: email.split('@')[0],
              profile: {
                firstName: 'مستخدم',
                lastName: 'تجريبي'
              },
              role: 'user',
              isAdmin: false
            },
            token: 'demo_token_user',
            isDatabaseMode: false
          });
        }
      } else if (type === 'register') {
        if (email && password) {
          return NextResponse.json({
            success: true,
            message: 'تم إنشاء حساب تجريبي',
            user: {
              id: 'demo_new_user',
              email: email,
              username: email.split('@')[0],
              profile: {
                firstName: 'مستخدم',
                lastName: 'جديد'
              },
              role: 'user',
              isAdmin: false
            },
            token: 'demo_token_new',
            isDatabaseMode: false
          });
        }
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
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
