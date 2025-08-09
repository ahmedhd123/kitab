'use client';

import BookReaderComponent from '@/components/BookReaderComponent';

export default function TestArabicReader() {
  const arabicBooks = [
    {
      id: "7",
      title: "دعاء الكروان",
      titleArabic: "دعاء الكروان",
      author: "طه حسين",
      authorArabic: "طه حسين",
      digitalFiles: {
        epub: {
          available: true,
          fileSize: 1100000,
          url: "/api/books/sample/7/content/epub"
        },
        txt: {
          available: true,
          fileSize: 320000,
          url: "/api/books/sample/7/content/txt"
        }
      }
    },
    {
      id: "8",
      title: "مدن الملح",
      titleArabic: "مدن الملح", 
      author: "عبد الرحمن منيف",
      authorArabic: "عبد الرحمن منيف",
      digitalFiles: {
        epub: {
          available: true,
          fileSize: 1800000,
          url: "/api/books/sample/8/content/epub"
        },
        mobi: {
          available: true,
          fileSize: 2100000,
          url: "/api/books/sample/8/content/mobi"
        }
      }
    },
    {
      id: "10",
      title: "1984",
      titleArabic: "1984",
      author: "George Orwell",
      authorArabic: "جورج أورويل",
      digitalFiles: {
        epub: {
          available: true,
          fileSize: 1350000,
          url: "/api/books/sample/10/content/epub"
        },
        txt: {
          available: true,
          fileSize: 850000,
          url: "/api/books/sample/10/content/txt"
        }
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            اختبار قارئ الكتب المحسن
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            جرب قراءة الكتب بصيغ مختلفة (EPUB, MOBI, TXT) مع ميزات متقدمة
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {arabicBooks.map((book) => (
              <div key={book.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" dir="rtl">
                    {book.titleArabic}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400" dir="rtl">
                    بقلم: {book.authorArabic}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {Object.keys(book.digitalFiles).map((format) => (
                      <span
                        key={format}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium uppercase"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
                
                <BookReaderComponent
                  bookId={book.id}
                  title={book.title}
                  author={book.author}
                  digitalFiles={book.digitalFiles}
                />
                
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  <p>الميزات المتاحة:</p>
                  <ul className="list-none mt-2 space-y-1" dir="rtl">
                    <li>• تخصيص الخط والحجم والثيم</li>
                    <li>• العلامات المرجعية والبحث</li>
                    <li>• دعم كامل للغة العربية</li>
                    <li>• تجربة قراءة تفاعلية</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">
              ✅ تم تحسين نظام القراءة بنجاح!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">الميزات الجديدة:</h4>
                <ul className="text-green-600 dark:text-green-300 space-y-1">
                  <li>• دعم EPUB, MOBI, TXT (بدلاً من PDF)</li>
                  <li>• أي شخص يمكنه قراءة أي كتاب</li>
                  <li>• محتوى عربي تجريبي</li>
                  <li>• واجهة متقدمة مع إعدادات شاملة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">الأدوات المتاحة:</h4>
                <ul className="text-green-600 dark:text-green-300 space-y-1">
                  <li>• فهرس المحتويات التفاعلي</li>
                  <li>• بحث سريع في النص</li>
                  <li>• نظام علامات مرجعية</li>
                  <li>• 4 ثيمات للقراءة</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
