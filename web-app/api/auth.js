// Auth API endpoint
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

  if (req.method === 'POST') {
    const { email, password, type } = req.body;

    // Simple auth for demo
    if (type === 'login') {
      if (email === 'admin@kitabi.com' && password === 'admin123') {
        res.status(200).json({
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
        res.status(200).json({
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
        res.status(401).json({
          success: false,
          message: 'بيانات الدخول غير صحيحة'
        });
      }
    } else if (type === 'register') {
      if (email && password) {
        res.status(200).json({
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
        res.status(400).json({
          success: false,
          message: 'الرجاء إدخال جميع البيانات المطلوبة'
        });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
