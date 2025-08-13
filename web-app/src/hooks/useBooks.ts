'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://kitab-production.up.railway.app' 
  : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface Book {
  id: string;
  _id?: string; // Added for MongoDB compatibility
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
  hasDigitalVersion?: boolean;
  status?: string;
  language?: string;
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

// Helper function to get books from localStorage
function getLocalBooks(): Book[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('localBooks');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
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

      // Try frontend API first (most reliable)
      let response = await fetch(`/api/books?${params.toString()}`);
      let data;
      
      if (response.ok) {
        data = await response.json();
      } else {
        // Fallback to Railway backend directly
        response = await fetch(`${API_BASE_URL}/api/books?${params.toString()}`);
        data = await response.json();
      }
      
      if (data.success) {
        // Map data to frontend format
        const mappedBooks = (data.data || []).map((book: any) => ({
          id: book._id || book.id,
          _id: book._id || book.id,
          title: book.title,
          titleArabic: book.title,
          author: book.author,
          authorArabic: book.author,
          year: book.publishYear || book.year || new Date().getFullYear(),
          genres: book.genre ? [book.genre] : book.genres || [],
          description: book.description || '',
          rating: book.rating || 0,
          ratingsCount: book.reviewCount || book.ratingsCount || 0,
          pages: book.pages || 0,
          isbn: book.isbn || '',
          coverImage: book.coverImage || `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title || 'كتاب')}`,
          digitalFiles: {
            epub: book.files?.epub ? {
              available: true,
              fileSize: book.files.epub.size || 0,
              url: `${API_BASE_URL}/uploads/books/${book.files.epub.filename}`
            } : undefined,
            pdf: book.files?.pdf ? {
              available: true,
              fileSize: book.files.pdf.size || 0,
              url: `${API_BASE_URL}/uploads/books/${book.files.pdf.filename}`
            } : undefined,
            mobi: book.files?.mobi ? {
              available: true,
              fileSize: book.files.mobi.size || 0,
              url: `${API_BASE_URL}/uploads/books/${book.files.mobi.filename}`
            } : undefined
          },
          hasDigitalVersion: !!(book.files?.epub || book.files?.pdf),
          status: book.status || 'published',
          language: book.language || 'arabic'
        }));

        // Merge with locally stored books (from localStorage)
        const localBooks = getLocalBooks();
        const allBooks = [...mappedBooks, ...localBooks];
        
        // Remove duplicates based on ID
        const uniqueBooks = allBooks.filter((book, index, self) => 
          index === self.findIndex((b) => b.id === book.id || b._id === book._id)
        );

        setBooks(uniqueBooks);
        
        setPagination({
          currentPage: data.meta?.pagination?.currentPage || 1,
          totalPages: data.meta?.pagination?.totalPages || 1,
          totalBooks: data.meta?.pagination?.totalItems || uniqueBooks.length,
          hasNext: data.meta?.pagination?.hasNextPage || false,
          hasPrev: data.meta?.pagination?.hasPrevPage || false
        });
      } else {
        // Fallback to local books only
        const localBooks = getLocalBooks();
        setBooks(localBooks);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalBooks: localBooks.length,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
      
      // Fallback to local books if available
      const localBooks = getLocalBooks();
      if (localBooks.length > 0) {
        setBooks(localBooks);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalBooks: localBooks.length,
          hasNext: false,
          hasPrev: false
        });
      } else {
        // Final fallback to sample data
        setBooks([
          {
            id: "sample-1",
            title: "كبرياء وتحامل",
            author: "جين أوستن",
            year: 1813,
            genres: ["رومانسية", "كلاسيكي"],
            description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية.",
            rating: 4.8,
            ratingsCount: 1247,
            pages: 432,
            isbn: "978-1-68158-035-0",
            coverImage: "https://via.placeholder.com/300x400?text=كبرياء+وتحامل",
            digitalFiles: {
              epub: {
                available: true,
                fileSize: 1024000,
                url: "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.epub"
              }
            },
            hasDigitalVersion: true,
            status: 'published',
            language: 'arabic'
          },
          {
            id: "sample-2",
            title: "غاتسبي العظيم",
            author: "ف. سكوت فيتزجيرالد",
            year: 1925,
            genres: ["خيال", "أدب أمريكي"],
            description: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
            rating: 4.6,
            ratingsCount: 2156,
            pages: 180,
            isbn: "978-1-68158-112-8",
            coverImage: "https://via.placeholder.com/300x400?text=غاتسبي+العظيم",
            digitalFiles: {
              epub: {
                available: true,
                fileSize: 856000,
                url: "https://standardebooks.org/ebooks/f-scott-fitzgerald/the-great-gatsby/downloads/f-scott-fitzgerald_the-great-gatsby.epub"
              }
            },
            hasDigitalVersion: true,
            status: 'published',
            language: 'arabic'
          }
        ]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalBooks: 2,
          hasNext: false,
          hasPrev: false
        });
      }
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
