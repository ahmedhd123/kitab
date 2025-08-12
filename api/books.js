// Books API Route
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Sample books data
  const sampleBooks = [
    {
      id: '1',
      title: 'الأسود يليق بك',
      author: 'أحلام مستغانمي',
      genre: 'أدب عربي',
      description: 'رواية عربية معاصرة',
      coverImage: '/images/book1.jpg',
      rating: 4.5,
      reviews: 120
    },
    {
      id: '2', 
      title: 'مئة عام من العزلة',
      author: 'غابرييل غارسيا ماركيز',
      genre: 'أدب عالمي',
      description: 'رواية من أشهر الروايات العالمية',
      coverImage: '/images/book2.jpg',
      rating: 4.8,
      reviews: 350
    }
  ];

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      books: sampleBooks,
      total: sampleBooks.length,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({
      error: 'Method not allowed',
      message: `${req.method} method is not supported on this endpoint`
    });
  }
}
