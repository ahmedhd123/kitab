import { NextRequest, NextResponse } from 'next/server';

// Demo users for production (in real app, this would be database lookup)
const DEMO_USERS = [
  {
    id: 'admin',
    email: 'admin@kitabi.com',
    password: 'admin123', // In real app, this would be hashed
    username: 'admin',
    profile: {
      firstName: 'مدير',
      lastName: 'الموقع'
    },
    role: 'admin',
    isAdmin: true
  },
  {
    id: 'user',
    email: 'user@kitabi.com',
    password: 'user123',
    username: 'user',
    profile: {
      firstName: 'مستخدم',
      lastName: 'تجريبي'
    },
    role: 'user',
    isAdmin: false
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, type, username, firstName, lastName, bio, favoriteGenres } = body;

    if (type === 'login') {
      // Find user by email
      const user = DEMO_USERS.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        return NextResponse.json({ 
          success: false, 
          message: 'البريد الإلكتروني أو كلمة السر غير صحيحة' 
        }, { status: 401 });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: userWithoutPassword,
        token: `demo_token_${user.role}_${Date.now()}`,
        isDatabaseMode: false
      });

    } else if (type === 'register') {
      // Check if user already exists
      const existingUser = DEMO_USERS.find(u => u.email === email);
      
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: 'هذا البريد الإلكتروني مسجل مسبقاً'
        }, { status: 409 });
      }

      // Create new demo user
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
        favoriteGenres
      };

      return NextResponse.json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: newUser,
        token: `demo_token_user_${Date.now()}`,
        isDatabaseMode: false
      });

    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'نوع العملية غير مدعوم' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Auth API Error:', error);
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
