'use client';

import { useState, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  titleArabic?: string;
  author: string;
  authorArabic?: string;
  year: number;
  genres: string[];
  description: string;
  rating: number;
  ratingsCount: number;
  pages: number;
  isbn: {
    isbn10?: string;
    isbn13?: string;
  } | string;
  coverImage: string;
  digitalFiles: {
    epub?: {
      available: boolean;
      fileSize: number;
      url: string;
    };
    pdf?: {
      available: boolean;
      fileSize: number;
      url: string;
    };
    mobi?: {
      available: boolean;
      fileSize: number;
      url: string;
    };
  };
}

export interface BooksResponse {
  success: boolean;
  data: {
    books: Book[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBooks: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export function useBooks(options?: {
  page?: number;
  limit?: number;
  genre?: string;
  author?: string;
  search?: string;
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.genre) params.append('genre', options.genre);
      if (options?.author) params.append('author', options.author);
      if (options?.search) params.append('search', options.search);

      const response = await fetch(`http://localhost:5000/api/books?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب الكتب');
      }

      const data = await response.json();
      
      if (data.success) {
        // تحويل البيانات من تنسيق backend إلى تنسيق frontend
        const mappedBooks = data.data.map((book: any) => ({
          id: book._id || book.id,
          title: book.title,
          titleArabic: book.title,
          author: book.author,
          authorArabic: book.author,
          year: book.publishYear || book.year || new Date().getFullYear(),
          genres: book.genre ? [book.genre] : book.genres || [],
          description: book.description || '',
          rating: book.rating || 0,
          ratingsCount: book.reviewCount || 0,
          pages: book.pages || 0,
          isbn: book.isbn || '',
          coverImage: book.coverImage || 'https://via.placeholder.com/300x400?text=كتاب',
          digitalFiles: {
            epub: book.files?.epub ? {
              available: true,
              fileSize: book.files.epub.size || 0,
              url: `http://localhost:5000/uploads/books/${book.files.epub.filename}`
            } : undefined,
            pdf: book.files?.pdf ? {
              available: true,
              fileSize: book.files.pdf.size || 0,
              url: `http://localhost:5000/uploads/books/${book.files.pdf.filename}`
            } : undefined,
            mobi: book.files?.mobi ? {
              available: true,
              fileSize: book.files.mobi.size || 0,
              url: `http://localhost:5000/uploads/books/${book.files.mobi.filename}`
            } : undefined
          }
        }));
        
        setBooks(mappedBooks);
        setPagination(data.meta || {
          currentPage: 1,
          totalPages: 1,
          totalBooks: mappedBooks.length,
          hasNext: false,
          hasPrev: false
        });
      } else {
        throw new Error('خطأ في البيانات المستلمة');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
      
      // Fallback to sample data
      setBooks([
        {
          id: "1",
          title: "كبرياء وتحامل",
          author: "جين أوستن",
          year: 1813,
          genres: ["رومانسية", "كلاسيكي"],
          description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية.",
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
            }
          }
        },
        {
          id: "2",
          title: "غاتسبي العظيم",
          author: "ف. سكوت فيتزجيرالد",
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [options?.page, options?.limit, options?.genre, options?.author, options?.search]);

  return {
    books,
    loading,
    error,
    pagination,
    refetch: fetchBooks
  };
}
