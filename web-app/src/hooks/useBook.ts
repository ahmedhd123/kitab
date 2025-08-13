'use client';

import { useState, useEffect } from 'react';
import { Book } from './useBooks';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://kitab-production.up.railway.app';

export function useBook(id: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        // Try frontend API first (most reliable)
        const frontendResponse = await fetch(`/api/books/${id}`);
        if (frontendResponse.ok) {
          const frontendData = await frontendResponse.json();
          if (frontendData.success && frontendData.data) {
            setBook(frontendData.data);
            return;
          }
        }

        // Fallback: get all books and find the one we need
        const allBooksResponse = await fetch('/api/books');
        if (allBooksResponse.ok) {
          const allBooksData = await allBooksResponse.json();
          if (allBooksData.success && allBooksData.data) {
            const foundBook = allBooksData.data.find((b: Book) => 
              b._id === id || b.id === id || String(b._id) === id || String(b.id) === id
            );
            if (foundBook) {
              setBook(foundBook);
              return;
            }
          }
        }

        // Last fallback: try admin books API
        const adminResponse = await fetch(`/api/admin/books`);
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          if (adminData.success && adminData.data) {
            const foundBook = adminData.data.find((b: Book) => 
              b._id === id || b.id === id || String(b._id) === id || String(b.id) === id
            );
            if (foundBook) {
              setBook(foundBook);
              return;
            }
          }
        }

        setError('لم يتم العثور على الكتاب');
        
      } catch (err: any) {
        console.error('Error fetching book:', err);
        setError('فشل في تحميل تفاصيل الكتاب');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
}
