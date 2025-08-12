import { NextRequest, NextResponse } from 'next/server';

// Import the shared books array and addBook function
let books: any[] = [
  {
    _id: '1',
    title: 'الأسود يليق بك',
    author: 'أحلام مستغانمي',
    description: 'رواية عربية رائعة تتناول قضايا المجتمع المعاصر',
    genre: 'الأدب العربي',
    language: 'arabic',
    publishYear: '2012',
    isbn: '978-1-234567-89-0',
    pages: '320',
    publisher: 'دار الآداب',
    tags: ['رواية', 'أدب عربي', 'معاصر'],
    status: 'published',
    isFree: true,
    price: '0',
    coverImage: '/images/books/cover1.jpg',
    files: {
      epub: { available: true, size: 1024000 },
      pdf: { available: true, size: 2048000 }
    },
    rating: 4.8,
    reviewCount: 245,
    downloadCount: 1247,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uploadedBy: 'admin'
  },
  {
    _id: '2',
    title: 'ذاكرة الجسد',
    author: 'أحلام مستغانمي',
    description: 'رواية تاريخية تجمع بين الحب والوطن',
    genre: 'الأدب العربي',
    language: 'arabic',
    publishYear: '1993',
    isbn: '978-1-234567-89-1',
    pages: '280',
    publisher: 'دار الآداب',
    tags: ['رواية', 'تاريخ', 'حب'],
    status: 'published',
    isFree: true,
    price: '0',
    coverImage: '/images/books/cover2.jpg',
    files: {
      epub: { available: true, size: 987000 },
      pdf: { available: true, size: 1876000 }
    },
    rating: 4.7,
    reviewCount: 189,
    downloadCount: 987,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uploadedBy: 'admin'
  }
];

let nextId = 3;

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filter books
    let filteredBooks = [...books];

    if (status) {
      filteredBooks = filteredBooks.filter(book => book.status === status);
    }

    if (search) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === genre);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks / limit);

    return NextResponse.json({
      success: true,
      data: {
        books: paginatedBooks,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    }, { headers });

  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء جلب الكتب' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح بالوصول' },
        { status: 401, headers }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    // Extract basic fields
    const bookData = {
      _id: String(nextId++),
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      description: formData.get('description') as string,
      genre: formData.get('genre') as string,
      language: formData.get('language') as string || 'arabic',
      publishYear: formData.get('publishYear') as string || '',
      isbn: formData.get('isbn') as string || '',
      pages: formData.get('pages') as string || '',
      publisher: formData.get('publisher') as string || '',
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      status: formData.get('status') as string || 'draft',
      isFree: formData.get('isFree') === 'true',
      price: formData.get('price') as string || '0',
      coverImage: `/images/books/cover${nextId}.jpg`, // Mock cover image
      files: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate required fields
    if (!bookData.title?.trim()) {
      return NextResponse.json(
        { success: false, message: 'عنوان الكتاب مطلوب' },
        { status: 400, headers }
      );
    }

    if (!bookData.author?.trim()) {
      return NextResponse.json(
        { success: false, message: 'اسم المؤلف مطلوب' },
        { status: 400, headers }
      );
    }

    if (!bookData.genre) {
      return NextResponse.json(
        { success: false, message: 'نوع الكتاب مطلوب' },
        { status: 400, headers }
      );
    }

    // Process file uploads (mock implementation)
    const fileTypes = ['epub', 'mobi', 'pdf', 'audiobook'];
    const files: any = {};
    
    fileTypes.forEach(type => {
      const file = formData.get(`files[${type}]`) as File;
      if (file) {
        files[type] = {
          available: true,
          size: file.size,
          originalName: file.name,
          url: `/api/books/${bookData._id}/files/${type}`
        };
      }
    });

    bookData.files = files;

    // Add to mock database
    books.push(bookData);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: bookData.status === 'published' ? 'تم نشر الكتاب بنجاح' : 'تم حفظ الكتاب كمسودة',
      data: bookData
    }, { headers });

  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء إنشاء الكتاب' 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
