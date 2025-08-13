// Main API endpoint
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      message: 'مرحباً بك في API منصة كتابي',
      message_en: 'Welcome to Kitabi Platform API',
      version: '1.0.0',
      status: 'active',
      endpoints: {
        health: '/api/health',
        books: '/api/books',
        auth: '/api/auth',
        users: '/api/users'
      },
      documentation: 'https://kitabi.vercel.app/docs',
      support: 'support@kitabi.com'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
