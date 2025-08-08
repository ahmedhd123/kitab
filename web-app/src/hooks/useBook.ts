'use client';

import { useState, useEffect } from 'react';
import { Book } from './useBooks';

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

        // Try to get specific book from sample API
        const response = await fetch(`http://localhost:5000/api/books/sample/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setBook(data.data);
          } else {
            setError(data.message || 'الكتاب غير موجود');
          }
        } else {
          // Fallback to frontend API
          const fallbackResponse = await fetch('/api/books/sample');
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.success) {
            const foundBook = fallbackData.data.books.find((b: Book) => b.id === id);
            if (foundBook) {
              setBook(foundBook);
            } else {
              setError('الكتاب غير موجود');
            }
          } else {
            setError('خطأ في جلب بيانات الكتاب');
          }
        }
      } catch (err) {
        console.error('useBook: Error fetching book:', err);
        setError('خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
}
