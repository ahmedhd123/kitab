'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  BookOpen, 
  Search,
  Bookmark,
  Type,
  Sun,
  Moon,
  Minus,
  Plus,
  X,
  Menu,
  List
} from 'lucide-react';

interface EpubReaderProps {
  bookId: string;
  bookTitle: string;
  author: string;
  onClose: () => void;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';
  lineHeight: number;
  margin: number;
}

const EpubReader: React.FC<EpubReaderProps> = ({ bookId, bookTitle, author, onClose }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    fontFamily: 'Cairo',
    theme: 'light',
    lineHeight: 1.6,
    margin: 20
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // محاكاة تحميل محتوى EPUB
  useEffect(() => {
    const loadEpubContent = async () => {
      setLoading(true);
      try {
        // في التطبيق الحقيقي، سيتم تحليل ملف EPUB
        // هنا نستخدم محتوى تجريبي للعرض
        const mockChapters: Chapter[] = [
          {
            id: 'chapter-1',
            title: 'الفصل الأول: مقدمة في الفلسفة الديكارتية',
            content: `
              <h1>مقدمة في الفلسفة الديكارتية</h1>
              <p>رينيه ديكارت (1596-1650) فيلسوف وعالم رياضيات وفيزياء فرنسي، يُعتبر أبو الفلسفة الحديثة. اشتهر بعبارته الشهيرة "أنا أفكر، إذن أنا موجود" (Cogito ergo sum).</p>
              
              <h2>الشك المنهجي</h2>
              <p>طور ديكارت منهجاً فلسفياً يقوم على الشك المنهجي، حيث يشك في كل شيء يمكن الشك فيه للوصول إلى حقائق يقينية لا يمكن الشك فيها.</p>
              
              <p>يبدأ ديكارت رحلته الفلسفية بالتساؤل حول طبيعة المعرفة والوجود. يطرح أسئلة جوهرية: كيف نعرف أن ما نراه حقيقي؟ هل يمكننا الوثوق بحواسنا؟</p>
              
              <blockquote>
                "إن الحواس تخدعنا أحياناً، ومن الحكمة ألا نثق تماماً فيما خدعنا مرة واحدة"
              </blockquote>
              
              <p>هذا المبدأ يقوده إلى الشك في كل شيء: الحواس، العالم الخارجي، حتى الرياضيات. لكن هناك شيء واحد لا يستطيع الشك فيه: أنه يشك، وبالتالي يفكر، وإذا كان يفكر فهو موجود.</p>
            `,
            order: 1
          },
          {
            id: 'chapter-2',
            title: 'الفصل الثاني: الكوجيتو وأسس المعرفة',
            content: `
              <h1>الكوجيتو وأسس المعرفة</h1>
              <p>الكوجيتو (Cogito) هو نقطة البداية في فلسفة ديكارت. من هذه النقطة اليقينية، يبني ديكارت نظاماً فلسفياً كاملاً.</p>
              
              <h2>من الفكر إلى الوجود</h2>
              <p>إذا كنت أشك، فأنا أفكر. وإذا كنت أفكر، فأنا موجود. هذا هو المنطق البسيط والعميق للكوجيتو.</p>
              
              <p>لكن ما هو هذا "الأنا" الذي يفكر؟ يجيب ديكارت: إنه الروح أو العقل، وهو جوهر مفكر مختلف تماماً عن الجسد المادي.</p>
              
              <h2>الثنائية الديكارتية</h2>
              <p>يميز ديكارت بين نوعين من الجواهر:</p>
              <ul>
                <li><strong>الجوهر المفكر (Res cogitans):</strong> العقل والروح، غير مادي</li>
                <li><strong>الجوهر المتمدد (Res extensa):</strong> الجسد والمادة، قابل للقياس</li>
              </ul>
              
              <p>هذا التقسيم سيؤثر على الفلسفة الغربية لقرون عديدة، ويثير أسئلة حول العلاقة بين العقل والجسد.</p>
            `,
            order: 2
          },
          {
            id: 'chapter-3',
            title: 'الفصل الثالث: إثبات وجود الله والعالم الخارجي',
            content: `
              <h1>إثبات وجود الله والعالم الخارجي</h1>
              <p>بعد إثبات وجود الذات المفكرة، ينتقل ديكارت لإثبات وجود الله، ثم العالم الخارجي.</p>
              
              <h2>البرهان الأنطولوجي</h2>
              <p>يقدم ديكارت عدة براهين على وجود الله، أشهرها البرهان الأنطولوجي:</p>
              
              <ol>
                <li>لدي فكرة عن كائن كامل (الله)</li>
                <li>أنا كائن ناقص، فكيف يمكنني أن أتصور الكمال؟</li>
                <li>هذه الفكرة لا بد أن تأتي من كائن كامل فعلاً</li>
                <li>إذن الله موجود</li>
              </ol>
              
              <h2>صدق الحواس</h2>
              <p>بعد إثبات وجود الله الكامل، يؤكد ديكارت أن الله لا يمكن أن يكون مخادعاً، وبالتالي يمكننا الوثوق في معرفتنا الواضحة والمتميزة.</p>
              
              <p>هذا يعيد التأكيد على صحة الرياضيات والعلوم الطبيعية، ويثبت وجود العالم الخارجي المادي.</p>
              
              <blockquote>
                "الله ليس مخادعاً، ولذلك فإن الحواس - عندما تُستخدم بحذر وبتوجيه من العقل - تعطينا معرفة صحيحة عن العالم"
              </blockquote>
            `,
            order: 3
          }
        ];

        setChapters(mockChapters);
        setLoading(false);
      } catch (error) {
        console.error('Error loading EPUB:', error);
        setLoading(false);
      }
    };

    loadEpubContent();
  }, [bookId]);

  // تحديث التقدم
  useEffect(() => {
    if (chapters.length > 0) {
      setProgress(((currentChapter + 1) / chapters.length) * 100);
    }
  }, [currentChapter, chapters.length]);

  // تطبيق الإعدادات
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const getContentStyle = () => ({
    fontSize: `${settings.fontSize}px`,
    fontFamily: settings.fontFamily,
    lineHeight: settings.lineHeight,
    padding: `${settings.margin}px`,
    direction: 'rtl'
  });

  // التنقل بين الفصول
  const goToNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  // البحث في المحتوى
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];
    chapters.forEach((chapter, chapterIndex) => {
      const content = chapter.content.replace(/<[^>]*>/g, ''); // إزالة HTML tags
      const regex = new RegExp(query, 'gi');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const start = Math.max(0, match.index - 50);
        const end = Math.min(content.length, match.index + query.length + 50);
        const excerpt = content.substring(start, end);
        
        results.push({
          chapterIndex,
          chapterTitle: chapter.title,
          excerpt: excerpt,
          position: match.index
        });
      }
    });
    
    setSearchResults(results);
  };

  // إضافة/إزالة علامة مرجعية
  const toggleBookmark = () => {
    const bookmarkId = `${currentChapter}`;
    if (bookmarks.includes(bookmarkId)) {
      setBookmarks(bookmarks.filter(id => id !== bookmarkId));
    } else {
      setBookmarks([...bookmarks, bookmarkId]);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الكتاب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 ${getThemeClasses()}`}>
      {/* شريط العنوان */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{bookTitle}</h1>
            <p className="text-sm opacity-75">{author}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowTOC(!showTOC)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <List className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded ${bookmarks.includes(currentChapter.toString()) ? 'text-yellow-500' : ''}`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* شريط البحث */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="البحث في الكتاب..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
          />
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentChapter(result.chapterIndex);
                    setShowSearch(false);
                  }}
                  className="block w-full text-right p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <div className="text-sm font-medium">{result.chapterTitle}</div>
                  <div className="text-xs opacity-75">...{result.excerpt}...</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex h-full">
        {/* جدول المحتويات */}
        {showTOC && (
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-bold mb-4">جدول المحتويات</h3>
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setCurrentChapter(index);
                    setShowTOC(false);
                  }}
                  className={`block w-full text-right p-2 rounded mb-1 ${
                    index === currentChapter 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col">
          {/* منطقة القراءة */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {chapters[currentChapter] && (
                <div
                  ref={contentRef}
                  style={getContentStyle()}
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: chapters[currentChapter].content 
                  }}
                />
              )}
            </div>
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={goToPrevChapter}
              disabled={currentChapter === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm">
                {currentChapter + 1} من {chapters.length}
              </span>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={goToNextChapter}
              disabled={currentChapter === chapters.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* لوحة الإعدادات */}
        {showSettings && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-bold mb-4">إعدادات القراءة</h3>
            
            {/* حجم الخط */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">حجم الخط</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettings({...settings, fontSize: Math.max(12, settings.fontSize - 1)})}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mx-2">{settings.fontSize}px</span>
                <button
                  onClick={() => setSettings({...settings, fontSize: Math.min(24, settings.fontSize + 1)})}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* نوع الخط */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">نوع الخط</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="Cairo">Cairo</option>
                <option value="Noto Sans Arabic">Noto Sans Arabic</option>
                <option value="Amiri">Amiri</option>
                <option value="Scheherazade">Scheherazade</option>
              </select>
            </div>

            {/* المظهر */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">المظهر</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings({...settings, theme: 'light'})}
                  className={`p-2 rounded ${settings.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSettings({...settings, theme: 'dark'})}
                  className={`p-2 rounded ${settings.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  <Moon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSettings({...settings, theme: 'sepia'})}
                  className={`p-2 rounded ${settings.theme === 'sepia' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* تباعد الأسطر */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">تباعد الأسطر</label>
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => setSettings({...settings, lineHeight: parseFloat(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm">{settings.lineHeight}</span>
            </div>

            {/* الهوامش */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">الهوامش</label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={settings.margin}
                onChange={(e) => setSettings({...settings, margin: parseInt(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm">{settings.margin}px</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpubReader;
