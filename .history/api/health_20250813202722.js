// Health Check API Route
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'production',
    service: 'Kitabi API',
    version: '1.0.0'
  });
}
