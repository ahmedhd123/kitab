'use client';

import { useState, useEffect } from 'react';

export default function TestBookPage() {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log('Fetching book data...');
        const response = await fetch('http://localhost:5000/api/books/sample/1');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          
          if (data.success) {
            setBook(data.data);
          } else {
            setError('Book not found');
          }
        } else {
          setError('API request failed');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, []);

  if (loading) {
    return <div style={{padding: '20px'}}>جاري التحميل...</div>;
  }

  if (error) {
    return <div style={{padding: '20px', color: 'red'}}>خطأ: {error}</div>;
  }

  if (!book) {
    return <div style={{padding: '20px'}}>لم يتم العثور على الكتاب</div>;
  }

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>اختبار صفحة الكتاب</h1>
      <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
        <h2>{book.title}</h2>
        <p><strong>المؤلف:</strong> {book.author}</p>
        <p><strong>العنوان بالعربية:</strong> {book.titleArabic}</p>
        <p><strong>المؤلف بالعربية:</strong> {book.authorArabic}</p>
        <p><strong>التقييم:</strong> {book.rating} ({book.ratingsCount} تقييم)</p>
        <p><strong>الأنواع:</strong> {book.genres?.join(', ')}</p>
        <p><strong>الوصف:</strong> {book.description}</p>
        
        <h3>الملفات الرقمية:</h3>
        <ul>
          {Object.entries(book.digitalFiles || {}).map(([format, file]: [string, any]) => (
            <li key={format}>
              {format}: {file.available ? 'متوفر' : 'غير متوفر'} 
              {file.fileSize && ` (${Math.round(file.fileSize / 1024)}KB)`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
