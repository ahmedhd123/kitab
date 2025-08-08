import { NextRequest, NextResponse } from 'next/server';

// Sample books data from Standard Ebooks
const sampleBooks = [
  {
    id: "1",
    title: "كبرياء وتحامل",
    titleArabic: "كبرياء وتحامل",
    author: "جين أوستن",
    authorArabic: "جين أوستن",
    year: 1813,
    genres: ["رومانسية", "أدب كلاسيكي"],
    description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية في إنجلترا الجورجية.",
    rating: 4.8,
    ratingsCount: 1247,
    pages: 432,
    isbn: "978-1-68158-035-0",
    coverImage: "https://standardebooks.org/images/covers/jane-austen_pride-and-prejudice.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1024000,
        url: "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.epub"
      },
      pdf: {
        available: true,
        fileSize: 2048000,
        url: "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.pdf"
      }
    }
  },
  {
    id: "2",
    title: "غاتسبي العظيم",
    titleArabic: "غاتسبي العظيم",
    author: "ف. سكوت فيتزجيرالد",
    authorArabic: "ف. سكوت فيتزجيرالد",
    year: 1925,
    genres: ["خيال", "أدب أمريكي"],
    description: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
    rating: 4.6,
    ratingsCount: 2156,
    pages: 180,
    isbn: "978-1-68158-112-8",
    coverImage: "https://standardebooks.org/images/covers/f-scott-fitzgerald_the-great-gatsby.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 856000,
        url: "https://standardebooks.org/ebooks/f-scott-fitzgerald/the-great-gatsby/downloads/f-scott-fitzgerald_the-great-gatsby.epub"
      }
    }
  },
  {
    id: "3",
    title: "مغامرات أليس في بلاد العجائب",
    titleArabic: "مغامرات أليس في بلاد العجائب",
    author: "لويس كارول",
    authorArabic: "لويس كارول",
    year: 1865,
    genres: ["خيال", "أدب الأطفال"],
    description: "رواية خيالية محبوبة للأطفال حول رحلة أليس عبر بلاد العجائب.",
    rating: 4.4,
    ratingsCount: 3421,
    pages: 96,
    isbn: "978-1-68158-001-5",
    coverImage: "https://standardebooks.org/images/covers/lewis-carroll_alices-adventures-in-wonderland.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 512000,
        url: "https://standardebooks.org/ebooks/lewis-carroll/alices-adventures-in-wonderland/downloads/lewis-carroll_alices-adventures-in-wonderland.epub"
      }
    }
  },
  {
    id: "4",
    title: "فرانكنشتاين",
    titleArabic: "فرانكنشتاين",
    author: "ماري شيلي",
    authorArabic: "ماري شيلي",
    year: 1818,
    genres: ["رعب", "خيال علمي"],
    description: "الرواية الأصلية للخيال العلمي حول عالم ينشئ الحياة.",
    rating: 4.2,
    ratingsCount: 1876,
    pages: 280,
    isbn: "978-1-68158-089-3",
    coverImage: "https://standardebooks.org/images/covers/mary-shelley_frankenstein.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1200000,
        url: "https://standardebooks.org/ebooks/mary-shelley/frankenstein/downloads/mary-shelley_frankenstein.epub"
      }
    }
  },
  {
    id: "5",
    title: "مغامرات شيرلوك هولمز",
    titleArabic: "مغامرات شيرلوك هولمز",
    author: "آرثر كونان دويل",
    authorArabic: "آرثر كونان دويل",
    year: 1892,
    genres: ["غموض", "بوليسي"],
    description: "قصص بوليسية كلاسيكية تضم المحقق الشهير شيرلوك هولمز.",
    rating: 4.7,
    ratingsCount: 4532,
    pages: 307,
    isbn: "978-1-68158-067-1",
    coverImage: "https://standardebooks.org/images/covers/arthur-conan-doyle_the-adventures-of-sherlock-holmes.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1456000,
        url: "https://standardebooks.org/ebooks/arthur-conan-doyle/the-adventures-of-sherlock-holmes/downloads/arthur-conan-doyle_the-adventures-of-sherlock-holmes.epub"
      }
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const genre = searchParams.get('genre');
    const author = searchParams.get('author');
    const search = searchParams.get('search');

    let filteredBooks = [...sampleBooks];

    // Apply filters
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
      );
    }

    if (author) {
      filteredBooks = filteredBooks.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase()) ||
        book.authorArabic.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (search) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.titleArabic.toLowerCase().includes(search.toLowerCase()) ||
        book.description.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        books: paginatedBooks,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredBooks.length / limit),
          totalBooks: filteredBooks.length,
          hasNext: endIndex < filteredBooks.length,
          hasPrev: startIndex > 0
        }
      }
    });

  } catch (error) {
    console.error('Error in sample books API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'خطأ في جلب الكتب',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}
