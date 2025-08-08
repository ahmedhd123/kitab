'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, BookOpen, Moon, Sun, ZoomIn, ZoomOut, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface BookReaderProps {
  bookId: string;
  format: 'epub' | 'pdf' | 'mobi';
  title: string;
  author: string;
  onClose: () => void;
}

interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';
  lineHeight: number;
  rtl: boolean;
}

const BookReader: React.FC<BookReaderProps> = ({ bookId, format, title, author, onClose }) => {
  const readerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(100);
  const [progress, setProgress] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [bookContent, setBookContent] = useState<string>('');
  
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    theme: 'light',
    lineHeight: 1.6,
    rtl: false
  });

  useEffect(() => {
    loadBook();
    
    // Load saved settings
    const savedSettings = localStorage.getItem('readerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Load saved progress
    const progressKey = `book-progress-${bookId}-${format}`;
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentPage(progress.currentPage || 1);
      setProgress(progress.progress || 0);
    }
  }, [bookId, format]);

  useEffect(() => {
    // Calculate progress
    const progressPercentage = (currentPage / totalPages) * 100;
    setProgress(progressPercentage);
    
    // Save progress
    saveProgress(progressPercentage);
  }, [currentPage, totalPages]);

  const loadBook = async () => {
    try {
      setIsLoading(true);
      
      // Get book metadata first (using sample API since we're working with sample data)
      const metadataResponse = await fetch(`http://localhost:5000/api/books/sample/${bookId}/metadata/${format}`);

      if (!metadataResponse.ok) {
        throw new Error('فشل في تحميل معلومات الكتاب');
      }

      const metadata = await metadataResponse.json();
      
      if (format === 'pdf') {
        loadPdfReader();
      } else {
        // For EPUB/MOBI, we'll show a placeholder for now
        setBookContent(`
          <div class="book-content">
            <h1 style="text-align: center; margin-bottom: 2rem;">${title}</h1>
            <h2 style="text-align: center; color: #666; margin-bottom: 3rem;">بقلم: ${author}</h2>
            
            <p style="margin-bottom: 1.5rem; text-align: justify;">
              هذا نص تجريبي لعرض كيفية عمل قارئ الكتب الإلكترونية. في التطبيق الحقيقي، سيتم تحميل محتوى الكتاب من الخادم وعرضه هنا.
            </p>
            
            <p style="margin-bottom: 1.5rem; text-align: justify;">
              يدعم القارئ العديد من الميزات مثل تغيير حجم الخط، واختيار نوع الخط، وتغيير المظهر (فاتح، داكن، بني داكن)، 
              ودعم النصوص العربية والاتجاه من اليمين إلى اليسار.
            </p>
            
            <p style="margin-bottom: 1.5rem; text-align: justify;">
              كما يمكن حفظ التقدم في القراءة والعودة إليه لاحقاً، وإضافة علامات مرجعية للصفحات المهمة.
            </p>
            
            <h3 style="margin: 2rem 0 1rem 0;">الفصل الأول</h3>
            <p style="margin-bottom: 1.5rem; text-align: justify;">
              يبدأ الكتاب هنا... سيتم استبدال هذا النص بالمحتوى الفعلي للكتاب عند دمج مكتبة Epub.js أو مكتبة أخرى لقراءة الكتب الإلكترونية.
            </p>
            
            <p style="margin-bottom: 1.5rem; text-align: justify;">
              لمتابعة التطوير، سنحتاج إلى:
              <br>• تثبيت مكتبة Epub.js أو مكتبة مشابهة
              <br>• تطوير واجهة لعرض فهرس المحتويات
              <br>• إضافة ميزة البحث داخل الكتاب
              <br>• تطوير نظام العلامات المرجعية والملاحظات
            </p>
          </div>
        `);
        setTotalPages(50); // Mock total pages
        setIsLoading(false);
      }

    } catch (err) {
      console.error('Error loading book:', err);
      setError('خطأ في تحميل الكتاب');
      setIsLoading(false);
    }
  };

  const loadPdfReader = () => {
    // For sample books, we'll use the direct URL from Standard Ebooks
    const pdfUrl = `http://localhost:5000/api/books/sample/${bookId}/metadata/${format}`;
    
    if (readerRef.current) {
      // For now, show a message that PDF viewing needs to be implemented
      readerRef.current.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5;">
          <div style="text-align: center; padding: 2rem;">
            <h2 style="margin-bottom: 1rem;">عذراً، عرض ملفات PDF قيد التطوير</h2>
            <p style="color: #666; margin-bottom: 2rem;">
              سيتم إضافة قارئ PDF في التحديث القادم. 
              <br>يمكنك تجربة الكتب بصيغة EPUB في الوقت الحالي.
            </p>
            <button onclick="window.open('${pdfUrl}', '_blank')" 
                    style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">
              فتح الكتاب في نافذة جديدة
            </button>
          </div>
        </div>
      `;
      setIsLoading(false);
    }
  };

  const saveProgress = async (progressPercentage: number) => {
    try {
      // For sample books, just save to localStorage for now
      const progressKey = `book-progress-${bookId}-${format}`;
      localStorage.setItem(progressKey, JSON.stringify({
        progress: progressPercentage,
        currentPage: currentPage,
        lastRead: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const navigateNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const navigatePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Apply settings to content
    applySettings(updatedSettings);
    
    // Save settings to localStorage
    localStorage.setItem('readerSettings', JSON.stringify(updatedSettings));
  };

  const applySettings = (settings: ReadingSettings) => {
    if (readerRef.current && format !== 'pdf') {
      const content = readerRef.current.querySelector('.book-content') as HTMLElement;
      if (content) {
        // Apply font settings
        content.style.fontSize = `${settings.fontSize}px`;
        content.style.fontFamily = settings.fontFamily;
        content.style.lineHeight = settings.lineHeight.toString();
        
        // Apply theme
        let backgroundColor = '#ffffff';
        let textColor = '#000000';
        
        switch (settings.theme) {
          case 'dark':
            backgroundColor = '#1a1a1a';
            textColor = '#e0e0e0';
            break;
          case 'sepia':
            backgroundColor = '#f7f3e9';
            textColor = '#5c4b37';
            break;
        }
        
        content.style.backgroundColor = backgroundColor;
        content.style.color = textColor;
        content.style.padding = '2rem';
        content.style.minHeight = '100vh';
        
        // Apply RTL
        if (settings.rtl) {
          content.style.direction = 'rtl';
          content.style.textAlign = 'right';
        } else {
          content.style.direction = 'ltr';
          content.style.textAlign = 'justify';
        }
      }
    }
  };

  useEffect(() => {
    if (bookContent && !isLoading) {
      if (readerRef.current && format !== 'pdf') {
        readerRef.current.innerHTML = bookContent;
        applySettings(settings);
      }
    }
  }, [bookContent, settings, isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الكتاب...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{title}</h1>
            <p className="text-gray-600 text-sm">{author}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-sm text-gray-500">
            صفحة {currentPage} من {totalPages}
          </span>
          {format !== 'pdf' && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="إعدادات القراءة"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-blue-600 h-1 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex relative">
        {/* Reader Container */}
        <div className={`flex-1 relative ${showSettings ? 'mr-80' : ''}`}>
          <div ref={readerRef} className="w-full h-full overflow-auto" />
          
          {/* Navigation Buttons */}
          {format !== 'pdf' && (
            <>
              <button
                onClick={navigatePrev}
                disabled={currentPage <= 1}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full disabled:opacity-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={navigateNext}
                disabled={currentPage >= totalPages}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full disabled:opacity-30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && format !== 'pdf' && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">إعدادات القراءة</h3>
            
            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">حجم الخط</label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => updateSettings({ fontSize: Math.max(12, settings.fontSize - 2) })}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm px-3">{settings.fontSize}px</span>
                <button
                  onClick={() => updateSettings({ fontSize: Math.min(24, settings.fontSize + 2) })}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">المظهر</label>
              <div className="space-y-2">
                {[
                  { key: 'light', label: 'فاتح', icon: Sun },
                  { key: 'dark', label: 'داكن', icon: Moon },
                  { key: 'sepia', label: 'بني داكن', icon: BookOpen }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => updateSettings({ theme: key as any })}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg border ${
                      settings.theme === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">نوع الخط</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Amiri', serif">أميري</option>
                <option value="'Noto Sans Arabic', sans-serif">Noto Sans Arabic</option>
              </select>
            </div>

            {/* RTL Toggle */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={settings.rtl}
                  onChange={(e) => updateSettings({ rtl: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">دعم النصوص العربية (RTL)</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReader;
