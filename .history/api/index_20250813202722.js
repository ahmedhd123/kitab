// Vercel API Route Handler
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log the request for debugging
  console.log(`API Request: ${req.method} ${req.url}`);

  // Main API response
  res.status(200).json({
    message: '📚 Kitabi Backend API',
    version: '1.0.0',
    status: 'Running on Vercel',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      books: '/api/books',
      auth: '/api/auth'
    }
  });
}
