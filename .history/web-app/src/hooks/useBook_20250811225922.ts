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

        // Create a timeout promise for faster fallback
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 2000)
        );

        // Try to get specific book from sample API with timeout
        const fetchPromise = fetch(`http://localhost:5000/api/books/sample/${id}`);
        
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setBook(data.data);
          } else {
            setError(data.message || 'الكتاب غير موجود');
          }
        } else {
          throw new Error('Backend not available');
        }
      } catch (err: any) {
        console.log('Primary API failed, trying fallback:', err.message);
        
        try {
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
        } catch (fallbackErr) {
          console.error('useBook: Fallback also failed:', fallbackErr);
          setError('خطأ في الاتصال بالخادم');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
}
