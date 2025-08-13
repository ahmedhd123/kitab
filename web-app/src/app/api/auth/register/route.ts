import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Registration request received:', { ...body, password: '[REDACTED]' });

    // Forward the request to Railway backend
    const backendUrl = `${BACKEND_URL}/api/auth/register`;
    console.log('Forwarding to backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response:', { ...data, token: data.token ? '[REDACTED]' : undefined });

    if (!response.ok) {
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'حدث خطأ أثناء التسجيل' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم التسجيل بنجاح',
      token: data.token,
      user: data.user
    });

  } catch (error) {
    console.error('Registration API error:', error);
    console.error('Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      cause: (error as any)?.cause
    });
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في الخادم' 
      },
      { status: 500 }
    );
  }
}
