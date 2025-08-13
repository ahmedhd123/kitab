import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';
const USE_DIRECT_MONGODB = false; // Force use Railway backend
const FORCE_RAILWAY = true; // Always use Railway backend for production

// JWT token generation (simplified for demo)
function generateToken(user: any) {
  return `jwt_${user.role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function handleDirectMongoDB(body: any) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const { email, password, type, username, firstName, lastName, bio, favoriteGenres } = body;

    if (type === 'login') {
      // Find user by email
      const user = await usersCollection.findOne({ email });
      
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          message: 'البريد الإلكتروني غير مسجل' 
        }, { status: 401 });
      }

      // Check password (in production, this would be hashed)
      const isValidPassword = user.password === password || await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return NextResponse.json({ 
          success: false, 
          message: 'كلمة السر غير صحيحة' 
        }, { status: 401 });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: userWithoutPassword,
        token: generateToken(user),
        isDatabaseMode: true,
        source: 'MongoDB Atlas Direct'
      });

    } else if (type === 'register') {
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: 'هذا البريد الإلكتروني مسجل مسبقاً'
        }, { status: 409 });
      }

      // Create new user
      const newUser = {
        email,
        password, // In production, hash this password
        username: username || email.split('@')[0],
        profile: {
          firstName: firstName || 'مستخدم',
          lastName: lastName || 'جديد'
        },
        role: email === 'admin@kitabi.com' ? 'admin' : 'user',
        isAdmin: email === 'admin@kitabi.com',
        bio,
        favoriteGenres: favoriteGenres || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await usersCollection.insertOne(newUser);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;

      return NextResponse.json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: { ...userWithoutPassword, _id: result.insertedId },
        token: generateToken(newUser),
        isDatabaseMode: true,
        source: 'MongoDB Atlas Direct'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Direct MongoDB error:', error);
    throw error;
  }
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

    // Always use Railway backend for production reliability
    if (FORCE_RAILWAY || !USE_DIRECT_MONGODB) {
      console.log(`� Using Railway backend: ${BACKEND_URL}/api/auth/${type}`);
      
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = type === 'login' 
        ? { email, password }
        : { email, password, username: username || email.split('@')[0], firstName, lastName, bio, favoriteGenres };

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

      // Final fallback to demo mode for network errors
      if (response.status >= 500) {
        console.log('🔄 Railway backend error, using demo fallback');
        return handleDemoFallback(body);
      }
      
      return NextResponse.json({
        success: false,
        message: data.message || 'حدث خطأ في الخادم'
      }, { status: response.status });
    }

    // Try direct MongoDB connection only if Railway is disabled
    if (USE_DIRECT_MONGODB) {

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
      // Final fallback to demo mode for network errors
      if (response.status >= 500) {
        console.log('🔄 Railway backend error, using demo fallback');
        return handleDemoFallback(body);
      }
      
      return NextResponse.json({
        success: false,
        message: data.message || 'خطأ في العملية',
        isDatabaseMode: false
      }, { status: response.status });
    }

    console.log('✅ Railway backend operation successful');
    return NextResponse.json({
      success: true,
      message: data.message,
      user: data.user,
      token: data.token,
      isDatabaseMode: true,
      source: 'Railway Backend'
    });

  } catch (error) {
    console.error('Authentication error:', error);
    
    // Final fallback to demo mode
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      console.log('🔄 Network error, using demo fallback');
      return handleDemoFallback(await request.json());
    }

    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في النظام' 
    }, { status: 500 });
  }
}

// Demo fallback function (only for complete failures)
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
        source: 'Demo Mode',
        message: 'تم الدخول بالوضع التجريبي'
      });
    } else if (email === 'user@kitabi.com' && password === 'user123') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'demo_user',
          email: 'user@kitabi.com',
          username: 'user',
          profile: { firstName: 'مستخدم', lastName: 'تجريبي' },
          role: 'user',
          isAdmin: false
        },
        token: 'demo_token_user',
        isDatabaseMode: false,
        source: 'Demo Mode',
        message: 'تم الدخول بالوضع التجريبي'
      });
    }
  } else if (type === 'register') {
    return NextResponse.json({
      success: true,
      user: {
        id: `demo_${Date.now()}`,
        email,
        username: email.split('@')[0],
        profile: { firstName: 'مستخدم', lastName: 'جديد' },
        role: 'user',
        isAdmin: false
      },
      token: `demo_token_${Date.now()}`,
      isDatabaseMode: false,
      source: 'Demo Mode',
      message: 'تم إنشاء حساب تجريبي (قاعدة البيانات غير متصلة)'
    }, { status: 201 });
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
