'use client';

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import EpubReader from './EpubReader';

interface BookReaderComponentProps {
  bookId: string;
  title: string;
  author: string;
  digitalFiles: {
    epub?: { available?: boolean; fileSize?: number; url?: string };
    mobi?: { available?: boolean; fileSize?: number; url?: string };
    pdf?: { available?: boolean; fileSize?: number; url?: string };
    audiobook?: { available?: boolean; fileSize?: number; duration?: number; url?: string };
  };
}

const BookReaderComponent: React.FC<BookReaderComponentProps> = ({
  bookId,
  title,
  author,
  digitalFiles
}) => {
  const [showReader, setShowReader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-select the best available format
  const getBestFormat = (): 'epub' | 'pdf' | 'mobi' | null => {
    if (digitalFiles.epub?.available !== false) return 'epub';
    if (digitalFiles.pdf?.available !== false) return 'pdf';
    if (digitalFiles.mobi?.available !== false) return 'mobi';
    return null;
  };

  const handleReadBook = async () => {
    const format = getBestFormat();
    if (!format || !bookId) {
      alert('لا توجد نسخ رقمية متاحة للقراءة');
      return;
    }

    console.log('Opening book:', { bookId, format, digitalFiles });
    setIsLoading(true);
    
    try {
      // للـ EPUB، نفتح القارئ مباشرة
      if (format === 'epub') {
        setShowReader(true);
        setIsLoading(false);
        return;
      }

      // للصيغ الأخرى، نتحقق من توفر المحتوى
      const response = await fetch(`http://localhost:5000/api/books/sample/${bookId}/metadata/${format}`);

      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Book metadata:', data);
        if (data.success) {
          setShowReader(true);
        } else {
          alert(data.message || 'خطأ في فتح الكتاب');
        }
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        alert(error.message || 'خطأ في فتح الكتاب');
      }
    } catch (error) {
      console.error('Error opening book:', error);
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const hasDigitalVersion = getBestFormat() !== null;

  console.log('BookReaderComponent debug:', { 
    bookId, 
    hasDigitalVersion, 
    bestFormat: getBestFormat(),
    digitalFiles: digitalFiles 
  });

  // Don't render if bookId is not available yet
  if (!bookId) {
    return null; // Return nothing instead of loading message
  }

  if (!hasDigitalVersion) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">لا توجد نسخ رقمية متاحة للقراءة</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            قراءة الكتاب الإلكتروني
          </h3>
          
          <button
            onClick={handleReadBook}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-medium transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري فتح الكتاب...
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                قراءة الكتاب
              </>
            )}
          </button>
          
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-4">
              {digitalFiles.epub?.available !== false && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>EPUB متوفر</span>
                </div>
              )}
              {digitalFiles.pdf?.available !== false && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>PDF متوفر</span>
                </div>
              )}
              {digitalFiles.mobi?.available !== false && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>MOBI متوفر</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-3">
            اضغط لبدء قراءة الكتاب في المتصفح بتجربة مشابهة لـ Kindle
          </p>
        </div>
      </div>

      {/* EPUB Reader */}
      {showReader && getBestFormat() === 'epub' && (
        <EpubReader
          bookId={bookId}
          bookTitle={title}
          author={author}
          onClose={() => setShowReader(false)}
        />
      )}
    </>
  );
};

export default BookReaderComponent;
