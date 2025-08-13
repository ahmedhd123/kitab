import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Login request received:', { ...body, password: '[REDACTED]' });

    // Forward the request to Railway backend
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Backend response:', { ...data, token: data.token ? '[REDACTED]' : undefined });

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'حدث خطأ أثناء تسجيل الدخول' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token: data.token,
      user: data.user
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في الخادم' 
      },
      { status: 500 }
    );
  }
}
