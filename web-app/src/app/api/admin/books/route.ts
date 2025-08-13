import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    
    // Forward all query parameters to backend
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Forward request to Railway backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/admin/books?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في جلب بيانات الكتب' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح بالدخول' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    
    console.log('📚 Sending book creation request to Railway backend');
    
    // Forward request to Railway backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/admin/books`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    });

    const responseText = await backendResponse.text();
    console.log('📝 Railway response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'خطأ في تحليل البيانات من الخادم',
          details: responseText.substring(0, 200)
        },
        { status: 500 }
      );
    }

    console.log('📝 Parsed Railway result:', data);

    if (data.success) {
      console.log('✅ Book created successfully:', data.data?.title);
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('❌ Error creating book:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطأ في إضافة الكتاب',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
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
