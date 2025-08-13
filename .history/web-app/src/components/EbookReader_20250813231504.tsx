'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Settings, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Type,
  Menu,
  Search,
  X
} from 'lucide-react';

interface EbookReaderProps {
  bookUrl: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookType?: 'epub' | 'pdf' | 'txt';
  onClose?: () => void;
}

export default function EbookReader({ bookUrl, bookTitle, bookType }: EbookReaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  const readerRef = useRef<HTMLDivElement>(null);
  const [bookContent, setBookContent] = useState<string>('');

  useEffect(() => {
    loadBook();
  }, [bookUrl, bookType]);

  const loadBook = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (bookType === 'epub') {
        await loadEpubBook();
      } else if (bookType === 'pdf') {
        await loadPdfBook();
      } else if (bookType === 'txt') {
        await loadTextBook();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الكتاب');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpubBook = async () => {
    // For demo, we'll create a sample EPUB content
    const sampleContent = `
      <div class="chapter">
        <h1>الفصل الأول</h1>
        <p>هذا نص تجريبي لكتاب إلكتروني. يمكن قراءة الكتب بصيغة EPUB بسهولة.</p>
        <p>يدعم القارئ العديد من المميزات مثل تغيير حجم الخط والوضع الليلي والإشارات المرجعية.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      <div class="chapter">
        <h1>الفصل الثاني</h1>
        <p>فصل آخر من الكتاب مع محتوى مختلف. يمكن التنقل بين الصفحات بسهولة.</p>
        <p>النص العربي يُعرض بشكل صحيح مع دعم كامل للغة العربية.</p>
      </div>
    `;
    
    setBookContent(sampleContent);
    setTotalPages(2);
  };

  const loadPdfBook = async () => {
    // For PDF, we would use PDF.js
    setBookContent(`
      <div class="pdf-page">
        <h2>صفحة PDF تجريبية</h2>
        <p>هذا محتوى تجريبي لملف PDF. في التطبيق الحقيقي، سيتم عرض الـ PDF الفعلي.</p>
      </div>
    `);
    setTotalPages(1);
  };

  const loadTextBook = async () => {
    try {
      const response = await fetch(bookUrl);
      const text = await response.text();
      const formattedText = text.split('\n').map(line => `<p>${line}</p>`).join('');
      setBookContent(formattedText);
      setTotalPages(Math.ceil(text.length / 2000)); // Estimate pages
    } catch (err) {
      throw new Error('فشل في تحميل الملف النصي');
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(page => page !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
  };

  const adjustZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    setZoom(newZoom);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الكتاب...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b shadow-sm`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-semibold truncate max-w-xs">{bookTitle}</h1>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarks.includes(currentPage)
                  ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="px-4 pb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في الكتاب..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className={`absolute right-4 top-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 z-20 w-64`}>
            <h3 className="font-semibold mb-3">إعدادات القراءة</h3>
            
            {/* Font Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">حجم الخط</label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => adjustFontSize(-2)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Type className="w-4 h-4" />
                </button>
                <span className="text-sm">{fontSize}px</span>
                <button
                  onClick={() => adjustFontSize(2)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Type className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Zoom */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">التكبير</label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => adjustZoom(-0.1)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => adjustZoom(0.1)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="mb-4">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium">الوضع الليلي</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div
            ref={readerRef}
            className="max-w-4xl mx-auto"
            style={{
              fontSize: `${fontSize}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              lineHeight: 1.6
            }}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: bookContent }}
              className="prose prose-lg dark:prose-invert max-w-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`sticky bottom-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t shadow-lg`}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-sm font-medium">
              {currentPage} من {totalPages}
            </span>
            
            {bookmarks.length > 0 && (
              <div className="flex items-center space-x-1 space-x-reverse">
                <Bookmark className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">{bookmarks.length}</span>
              </div>
            )}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
