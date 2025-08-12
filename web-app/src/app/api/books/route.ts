import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sampleBooks = [
    {
      id: 1,
      title: 'الأسود يليق بك',
      titleAr: 'الأسود يليق بك',
      author: 'أحلام مستغانمي',
      authorAr: 'أحلام مستغانمي',
      description: 'رواية عربية معاصرة تتحدث عن الحب والحياة',
      descriptionAr: 'رواية عربية معاصرة تتحدث عن الحب والحياة',
      genre: 'رواية',
      publishYear: 2012,
      rating: 4.5,
      reviewsCount: 1234,
      language: 'ar',
      coverImage: '/images/books/cover1.jpg',
      isAvailable: true
    },
    {
      id: 2,
      title: 'ذاكرة الجسد',
      titleAr: 'ذاكرة الجسد',
      author: 'أحلام مستغانمي',
      authorAr: 'أحلام مستغانمي',
      description: 'الجزء الأول من ثلاثية الذاكرة',
      descriptionAr: 'الجزء الأول من ثلاثية الذاكرة',
      genre: 'رواية',
      publishYear: 1993,
      rating: 4.7,
      reviewsCount: 2156,
      language: 'ar',
      coverImage: '/images/books/cover2.jpg',
      isAvailable: true
    },
    {
      id: 3,
      title: 'مئة عام من العزلة',
      titleAr: 'مئة عام من العزلة',
      author: 'غابرييل غارسيا ماركيز',
      authorAr: 'غابرييل غارسيا ماركيز',
      description: 'رواية كلاسيكية من أدب أمريكا اللاتينية',
      descriptionAr: 'رواية كلاسيكية من أدب أمريكا اللاتينية',
      genre: 'رواية',
      publishYear: 1967,
      rating: 4.6,
      reviewsCount: 3421,
      language: 'ar',
      coverImage: '/images/books/cover3.jpg',
      isAvailable: true
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      titleAr: 'كبرياء وهوى',
      author: 'Jane Austen',
      authorAr: 'جين أوستن',
      description: 'A classic English romance novel',
      descriptionAr: 'رواية إنجليزية كلاسيكية رومانسية',
      genre: 'Romance',
      publishYear: 1813,
      rating: 4.3,
      reviewsCount: 5432,
      language: 'en',
      coverImage: '/images/books/cover4.jpg',
      isAvailable: true
    },
    {
      id: 5,
      title: 'To Kill a Mockingbird',
      titleAr: 'قتل طائر مقلد',
      author: 'Harper Lee',
      authorAr: 'هاربر لي',
      description: 'A novel about racial injustice in the American South',
      descriptionAr: 'رواية عن الظلم العنصري في جنوب أمريكا',
      genre: 'Fiction',
      publishYear: 1960,
      rating: 4.4,
      reviewsCount: 4321,
      language: 'en',
      coverImage: '/images/books/cover5.jpg',
      isAvailable: true
    }
  ];

  return NextResponse.json({
    success: true,
    data: sampleBooks,
    total: sampleBooks.length,
    message: 'Books retrieved successfully'
  });
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
