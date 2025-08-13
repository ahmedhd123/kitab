import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://kitab-production.up.railway.app' 
  : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    
    // Forward all query parameters to backend
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    // Forward request to Railway backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/books?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
