import { NextRequest, NextResponse } from 'next/server';

// Mock database - في التطبيق الحقيقي سيكون هذا في قاعدة بيانات
let books: any[] = [
  {
    _id: '1',
    title: 'الأسود يليق بك',
    author: 'أحلام مستغانمي',
    description: 'رواية عربية رائعة تتناول قضايا المجتمع المعاصر وتجسد صراع الهوية والانتماء',
    genre: 'الأدب العربي',
    language: 'arabic',
    publishYear: 2012,
    isbn: '978-1-234567-89-0',
    pages: 320,
    publisher: 'دار الآداب',
    tags: ['رواية', 'أدب عربي', 'معاصر'],
    status: 'published',
    isFree: true,
    price: 0,
    rating: 4.8,
    reviewCount: 245,
    downloadCount: 1247,
    coverImage: '/images/books/cover1.jpg',
    files: {
      epub: {
        filename: 'black-suits-you.epub',
        originalName: 'الأسود يليق بك.epub',
        path: '/files/books/1/epub',
        size: 1024000,
        mimetype: 'application/epub+zip'
      },
      pdf: {
        filename: 'black-suits-you.pdf',
        originalName: 'الأسود يليق بك.pdf',
        path: '/files/books/1/pdf',
        size: 2048000,
        mimetype: 'application/pdf'
      }
    },
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    uploadedBy: 'admin'
  },
  {
    _id: '2',
    title: 'ذاكرة الجسد',
    author: 'أحلام مستغانمي',
    description: 'رواية تاريخية تجمع بين الحب والوطن، تحكي قصة الجزائر من خلال شخصياتها',
    genre: 'الأدب العربي',
    language: 'arabic',
    publishYear: 1993,
    isbn: '978-1-234567-89-1',
    pages: 280,
    publisher: 'دار الآداب',
    tags: ['رواية', 'تاريخ', 'حب'],
    status: 'published',
    isFree: true,
    price: 0,
    rating: 4.7,
    reviewCount: 189,
    downloadCount: 987,
    coverImage: '/images/books/cover2.jpg',
    files: {
      epub: {
        filename: 'memory-of-body.epub',
        originalName: 'ذاكرة الجسد.epub',
        path: '/files/books/2/epub',
        size: 987000,
        mimetype: 'application/epub+zip'
      },
      pdf: {
        filename: 'memory-of-body.pdf',
        originalName: 'ذاكرة الجسد.pdf',
        path: '/files/books/2/pdf',
        size: 1876000,
        mimetype: 'application/pdf'
      },
      mobi: {
        filename: 'memory-of-body.mobi',
        originalName: 'ذاكرة الجسد.mobi',
        path: '/files/books/2/mobi',
        size: 1456000,
        mimetype: 'application/x-mobipocket-ebook'
      }
    },
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
    uploadedBy: 'admin'
  }
];

// Function to add a new book from the admin panel
export function addBook(bookData: any) {
  const newId = String(books.length + 1);
  const newBook = {
    ...bookData,
    _id: newId,
    rating: 0,
    reviewCount: 0,
    downloadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uploadedBy: 'admin'
  };
  
  books.push(newBook);
  return newBook;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const bookId = params.id;

    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح بالوصول' },
        { status: 401, headers }
      );
    }

    // Find the book
    const book = books.find(b => b._id === bookId);

    if (!book) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'لم يتم العثور على الكتاب' 
        },
        { status: 404, headers }
      );
    }

    return NextResponse.json({
      success: true,
      data: book
    }, { headers });

  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء جلب تفاصيل الكتاب' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const bookId = params.id;

    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح بالوصول' },
        { status: 401, headers }
      );
    }

    // Find book index
    const bookIndex = books.findIndex(b => b._id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'لم يتم العثور على الكتاب' 
        },
        { status: 404, headers }
      );
    }

    // Parse update data
    const updateData = await request.json();

    // Update book
    books[bookIndex] = {
      ...books[bookIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الكتاب بنجاح',
      data: books[bookIndex]
    }, { headers });

  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء تحديث الكتاب' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const bookId = params.id;

    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح بالوصول' },
        { status: 401, headers }
      );
    }

    // Find book index
    const bookIndex = books.findIndex(b => b._id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'لم يتم العثور على الكتاب' 
        },
        { status: 404, headers }
      );
    }

    // Remove book
    const deletedBook = books.splice(bookIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'تم حذف الكتاب بنجاح',
      data: deletedBook
    }, { headers });

  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء حذف الكتاب' 
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
