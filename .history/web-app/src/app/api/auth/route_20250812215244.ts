import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, type } = body;

    // Simple auth for demo
    if (type === 'login') {
      if (email === 'admin@kitabi.com' && password === 'admin123') {
        return NextResponse.json({
          success: true,
          user: {
            id: 1,
            email: 'admin@kitabi.com',
            name: 'مدير الموقع',
            role: 'admin'
          },
          token: 'demo_token_123'
        });
      } else if (email && password) {
        return NextResponse.json({
          success: true,
          user: {
            id: 2,
            email: email,
            name: 'مستخدم',
            role: 'user'
          },
          token: 'demo_token_456'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'بيانات الدخول غير صحيحة'
        }, { status: 401 });
      }
    } else if (type === 'register') {
      if (email && password) {
        return NextResponse.json({
          success: true,
          user: {
            id: 3,
            email: email,
            name: 'مستخدم جديد',
            role: 'user'
          },
          token: 'demo_token_789'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'الرجاء إدخال جميع البيانات المطلوبة'
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'نوع العملية غير مدعوم' 
    }, { status: 400 });

  } catch (error) {
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
