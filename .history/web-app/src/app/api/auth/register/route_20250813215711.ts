import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username, firstName, lastName, bio, favoriteGenres } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'البريد الإلكتروني وكلمة السر مطلوبان'
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'البريد الإلكتروني غير صحيح'
      }, { status: 400 });
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'كلمة السر يجب أن تكون 6 أحرف على الأقل'
      }, { status: 400 });
    }

    // In production, this would check database for existing users
    // For demo, we'll accept all registrations except for existing demo users
    const existingEmails = ['admin@kitabi.com', 'user@kitabi.com'];
    if (existingEmails.includes(email)) {
      return NextResponse.json({
        success: false,
        message: 'هذا البريد الإلكتروني مسجل مسبقاً'
      }, { status: 409 });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      username: username || email.split('@')[0],
      profile: {
        firstName: firstName || 'مستخدم',
        lastName: lastName || 'جديد'
      },
      role: 'user',
      isAdmin: false,
      bio,
      favoriteGenres: favoriteGenres || [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: newUser,
      token: `demo_token_user_${Date.now()}`
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطأ في إنشاء الحساب'
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
