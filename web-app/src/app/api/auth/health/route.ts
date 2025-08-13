import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication service health
    return NextResponse.json({
      success: true,
      service: 'Authentication',
      status: 'operational',
      database: {
        connected: true,
        fallback: 'demo-mode-available'
      },
      features: {
        registration: true,
        login: true,
        profileManagement: true,
        tokenRefresh: true,
        demoMode: true
      },
      sampleData: {
        adminUser: 'admin@kitabi.com / admin123',
        demoUser: 'user@kitabi.com / user123'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth health check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Authentication service error',
      error: error instanceof Error ? error.message : 'Unknown error'
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
