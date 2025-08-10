'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Settings, BookOpen, Moon, Sun, ZoomIn, ZoomOut, 
  ArrowRight, ArrowLeft, X, Menu, Search, Bookmark, Type, Palette, 
  SkipBack, SkipForward, Home, Volume2
} from 'lucide-react';

interface BookReaderProps {
  bookId: string;
  format: 'epub' | 'pdf' | 'mobi' | 'txt';
  title: string;
  author: string;
  onClose: () => void;
}

interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia' | 'night';
  lineHeight: number;
  rtl: boolean;
  margin: number;
  maxWidth: number;
}

interface Chapter {
  id: string;
  title: string;
  href: string;
  level: number;
}

interface Bookmark {
  id: string;
  chapter: string;
  position: number;
  timestamp: number;
  note?: string;
}

const BookReader: React.FC<BookReaderProps> = ({ bookId, format, title, author, onClose }) => {
  const readerRef = useRef<HTMLDivElement>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTOC, setShowTOC] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [bookContent, setBookContent] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 18,
    fontFamily: 'Georgia, serif',
    theme: 'light',
    lineHeight: 1.6,
    rtl: false,
    margin: 60,
    maxWidth: 800
  });

  // Theme configurations
  const themes = {
    light: {
      background: '#ffffff',
      text: '#333333',
      accent: '#6366f1'
    },
    dark: {
      background: '#1a1a1a',
      text: '#e5e5e5',
      accent: '#8b5cf6'
    },
    sepia: {
      background: '#f4f1e8',
      text: '#5c4b37',
      accent: '#8b5a2b'
    },
    night: {
      background: '#0f0f0f',
      text: '#cccccc',
      accent: '#6366f1'
    }
  };

  const fontFamilies = [
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Cairo', value: 'Cairo, sans-serif' },
    { name: 'Amiri', value: 'Amiri, serif' },
    { name: 'Noto Sans Arabic', value: 'Noto Sans Arabic, sans-serif' }
  ];

  useEffect(() => {
    loadBook();
    loadSavedSettings();
    loadBookmarks();
    
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (!settings.rtl) nextPage();
          else previousPage();
          break;
        case 'ArrowRight':
          if (!settings.rtl) previousPage();
          else nextPage();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 's':
          setShowSettings(!showSettings);
          break;
        case 't':
          setShowTOC(!showTOC);
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [bookId, format, settings.rtl, showSettings, showTOC]);

  useEffect(() => {
    saveSettings();
  }, [settings]);

  useEffect(() => {
    updateProgress();
  }, [currentChapter, currentPage, totalPages]);

  const loadSavedSettings = () => {
    const savedSettings = localStorage.getItem('readerSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  };

  const saveSettings = () => {
    localStorage.setItem('readerSettings', JSON.stringify(settings));
  };

  const loadBookmarks = () => {
    const savedBookmarks = localStorage.getItem(`bookmarks-${bookId}`);
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  };

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    localStorage.setItem(`bookmarks-${bookId}`, JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const updateProgress = () => {
    const totalChapters = chapters.length || 1;
    const chapterProgress = currentChapter / totalChapters;
    const pageProgress = currentPage / totalPages;
    const overallProgress = (chapterProgress + (pageProgress / totalChapters)) * 100;
    setProgress(Math.min(100, Math.max(0, overallProgress)));
    
    // Save reading progress
    const progressData = {
      currentChapter,
      currentPage,
      progress: overallProgress,
      timestamp: Date.now()
    };
    localStorage.setItem(`progress-${bookId}`, JSON.stringify(progressData));
  };

  const loadBook = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Load book metadata
      const metadataResponse = await fetch(`http://localhost:5000/api/books/sample/${bookId}/metadata/${format}`);
      
      if (!metadataResponse.ok) {
        throw new Error('فشل في تحميل معلومات الكتاب');
      }

      const metadata = await metadataResponse.json();
      
      // Load book content based on format and language
      if (metadata.data.language === 'ar') {
        // Load Arabic content from our API
        await loadArabicContent(metadata.data);
      } else if (format === 'epub') {
        await loadEpubContent(metadata.data.url);
      } else if (format === 'txt') {
        await loadTextContent(metadata.data.url);
      } else {
        // Generate sample content for demo
        generateSampleContent();
      }
      
      setIsLoading(false);
      
      // Load saved progress
      const savedProgress = localStorage.getItem(`progress-${bookId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCurrentChapter(progress.currentChapter || 0);
        setCurrentPage(progress.currentPage || 1);
      }
      
    } catch (err) {
      console.error('Error loading book:', err);
      setError(err instanceof Error ? err.message : 'خطأ في تحميل الكتاب');
      setIsLoading(false);
    }
  };

  const loadArabicContent = async (bookData: any) => {
    try {
      // Try to load content from our API
      const contentResponse = await fetch(`http://localhost:5000/api/books/sample/${bookId}/content/${format}`);
      
      if (contentResponse.ok) {
        if (format === 'txt') {
          const textContent = await contentResponse.text();
          setBookContent(formatArabicTextContent(textContent));
          // Extract chapters from text content
          const chapterList = extractChaptersFromText(textContent);
          setChapters(chapterList);
          setTotalPages(chapterList.length);
        } else {
          const data = await contentResponse.json();
          if (data.content) {
            setBookContent(data.content);
            setChapters(data.chapters || []);
            setTotalPages(data.chapters?.length || 1);
          }
        }
      } else {
        // Fallback to generated content
        generateArabicSampleContent(bookData);
      }
    } catch (error) {
      console.log('Using fallback content for Arabic book');
      generateArabicSampleContent(bookData);
    }
  };

  const formatArabicTextContent = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return `
      <div class="arabic-text-content" dir="rtl">
        ${paragraphs.map(paragraph => {
          if (paragraph.startsWith('الفصل') || paragraph.includes('الفصل')) {
            return `<h2 style="margin: 3rem 0 2rem 0; font-size: 1.8rem; font-weight: bold; color: #4f46e5; text-align: center;">${paragraph}</h2>`;
          }
          return `<p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8; text-indent: 2rem;">${paragraph}</p>`;
        }).join('')}
      </div>
    `;
  };

  const extractChaptersFromText = (text: string): Chapter[] => {
    const lines = text.split('\n');
    const chapterList: Chapter[] = [];
    let chapterIndex = 1;

    lines.forEach((line, index) => {
      if (line.includes('الفصل') || line.startsWith('الفصل')) {
        chapterList.push({
          id: chapterIndex.toString(),
          title: line.trim(),
          href: `#chapter-${chapterIndex}`,
          level: 1
        });
        chapterIndex++;
      }
    });

    return chapterList.length > 0 ? chapterList : [
      { id: '1', title: 'النص الكامل', href: '#chapter-1', level: 1 }
    ];
  };

  const generateArabicSampleContent = (bookData: any) => {
    const sampleChapters: Chapter[] = [
      { id: '1', title: 'مقدمة الكتاب', href: '#chapter-1', level: 1 },
      { id: '2', title: 'الفصل الأول: البداية', href: '#chapter-2', level: 1 },
      { id: '3', title: 'الفصل الثاني: التطور', href: '#chapter-3', level: 1 },
      { id: '4', title: 'الفصل الثالث: الذروة', href: '#chapter-4', level: 1 },
      { id: '5', title: 'الفصل الرابع: النهاية', href: '#chapter-5', level: 1 },
      { id: '6', title: 'الخاتمة', href: '#chapter-6', level: 1 }
    ];
    
    setChapters(sampleChapters);
    setTotalPages(sampleChapters.length);
    
    setBookContent(`
      <div class="arabic-book-content" dir="rtl" id="chapter-${currentChapter + 1}">
        <h1 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem; font-weight: bold; color: #1e40af;">${bookData.titleArabic || title}</h1>
        <h2 style="text-align: center; color: #6b7280; margin-bottom: 4rem; font-size: 1.5rem;">بقلم: ${bookData.authorArabic || author}</h2>
        
        <div style="margin-bottom: 4rem; padding: 2rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; border-right: 6px solid #3b82f6;">
          <p style="font-size: 1.1rem; line-height: 1.8; margin: 0; text-align: justify; color: #1e40af;">
            ${bookData.description}
          </p>
        </div>
        
        <h2 style="margin: 3rem 0 2rem 0; font-size: 2rem; font-weight: bold; color: #4f46e5; text-align: center;">
          ${sampleChapters[currentChapter]?.title || 'الفصل الحالي'}
        </h2>
        
        <div style="margin: 3rem 0;">
          <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.9; text-indent: 2rem; font-size: 1.1rem;">
            في عالم مليء بالكلمات والحكايات، تبرز هذه القصة كواحدة من أجمل ما كُتب في الأدب العربي. إنها حكاية عن الحب والحياة، عن الأمل والألم، عن كل ما يجعل الإنسان إنساناً.
          </p>
          
          <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.9; text-indent: 2rem; font-size: 1.1rem;">
            تأخذنا هذه الرواية في رحلة عبر الزمن والمكان، حيث نتعرف على شخصيات حية نابضة بالحياة، كل منها تحمل في طياتها حكاية خاصة وتجربة فريدة تثري النص وتضفي عليه عمقاً وجمالاً.
          </p>
          
          <blockquote style="margin: 3rem 2rem; padding: 2rem; background: rgba(139, 92, 246, 0.1); border-right: 4px solid #8b5cf6; font-style: italic; font-size: 1.15rem; line-height: 1.8;">
            "الأدب مرآة الحياة، وفيه نرى انعكاس أرواحنا وأحلامنا، وعبره نسافر إلى عوالم لا تحدها الجغرافيا أو الزمان."
          </blockquote>
          
          <h3 style="margin: 2.5rem 0 1.5rem 0; font-size: 1.6rem; font-weight: bold; color: #059669; text-align: center;">
            عن هذا العمل الأدبي
          </h3>
          
          <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.9; text-indent: 2rem; font-size: 1.1rem;">
            يتميز هذا العمل بأسلوبه الراقي ولغته الجميلة التي تأسر القارئ من السطر الأول. الكاتب ينسج خيوط الحكاية بمهارة فائقة، مزج بين الواقع والخيال، بين الحاضر والماضي، ليقدم لنا عملاً أدبياً متكاملاً.
          </p>
          
          <div style="margin: 3rem 0; padding: 2rem; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
            <h4 style="margin-bottom: 1.5rem; color: #16a34a; font-weight: bold; font-size: 1.3rem; text-align: center;">ميزات هذه النسخة الرقمية:</h4>
            <ul style="margin: 0; padding-right: 2rem; line-height: 1.8;">
              <li style="margin-bottom: 1rem;">نص محقق ومراجع بعناية فائقة</li>
              <li style="margin-bottom: 1rem;">تنسيق متقدم يدعم القراءة المريحة</li>
              <li style="margin-bottom: 1rem;">إمكانية تخصيص الخط والحجم والثيم</li>
              <li style="margin-bottom: 1rem;">نظام علامات مرجعية متطور</li>
              <li style="margin-bottom: 1rem;">بحث سريع وذكي في النص</li>
              <li style="margin-bottom: 1rem;">مزامنة التقدم عبر الأجهزة</li>
            </ul>
          </div>
          
          <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.9; text-indent: 2rem; font-size: 1.1rem;">
            يمكنك الآن الاستمتاع بتجربة قراءة رقمية متكاملة تجمع بين جمال النص الأدبي وحداثة التكنولوجيا. استخدم الأدوات المتاحة في شريط الأدوات لتخصيص تجربة قراءتك حسب تفضيلاتك الشخصية.
          </p>
        </div>
      </div>
    `);
  };

  const loadEpubContent = async (url: string) => {
    // For demo purposes, we'll generate structured content
    // In a real implementation, you'd use epub.js library
    const sampleChapters: Chapter[] = [
      { id: '1', title: 'Introduction', href: '#chapter-1', level: 1 },
      { id: '2', title: 'Chapter One: The Beginning', href: '#chapter-2', level: 1 },
      { id: '3', title: 'Chapter Two: Development', href: '#chapter-3', level: 1 },
      { id: '4', title: 'Chapter Three: The Climax', href: '#chapter-4', level: 1 },
      { id: '5', title: 'Conclusion', href: '#chapter-5', level: 1 }
    ];
    
    setChapters(sampleChapters);
    setTotalPages(sampleChapters.length);
    generateSampleContent();
  };

  const loadTextContent = async (url: string) => {
    // Load plain text content
    try {
      const response = await fetch(url);
      const text = await response.text();
      setBookContent(formatTextContent(text));
      setTotalPages(Math.ceil(text.length / 2000)); // Rough page calculation
    } catch (error) {
      generateSampleContent();
    }
  };

  const formatTextContent = (text: string) => {
    return `
      <div class="text-content">
        ${text.split('\n\n').map(paragraph => 
          `<p style="margin-bottom: 1.5rem; text-align: justify;">${paragraph}</p>`
        ).join('')}
      </div>
    `;
  };

  const generateSampleContent = () => {
    const sampleChapters: Chapter[] = [
      { id: '1', title: 'Book Introduction', href: '#chapter-1', level: 1 },
      { id: '2', title: 'Chapter One: Understanding Digital Reading', href: '#chapter-2', level: 1 },
      { id: '3', title: 'Technology and Books', href: '#chapter-3', level: 2 },
      { id: '4', title: 'Chapter Two: The Future of Publishing', href: '#chapter-4', level: 1 },
      { id: '5', title: 'AI in Reading', href: '#chapter-5', level: 2 },
      { id: '6', title: 'Conclusion and Recommendations', href: '#chapter-6', level: 1 }
    ];
    
    setChapters(sampleChapters);
    setTotalPages(sampleChapters.length);
    
    setBookContent(`
      <div class="book-content" id="chapter-${currentChapter + 1}">
        <h1 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem; font-weight: bold;">${title}</h1>
        <h2 style="text-align: center; color: #666; margin-bottom: 4rem; font-size: 1.5rem;">By: ${author}</h2>
        
        <h2 style="margin: 3rem 0 2rem 0; font-size: 2rem; font-weight: bold; color: #4f46e5;">
          ${sampleChapters[currentChapter]?.title || 'Current Chapter'}
        </h2>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          In today's fast-paced world, reading has transformed from a mere recreational activity into a vital necessity for learning and personal growth. With tremendous technological advancements, digital books have emerged as an innovative solution that combines accessibility with rich content.
        </p>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          This digital book explores the world of electronic reading and provides a comprehensive vision of the future of digital publishing and learning. Through its pages, you'll discover the latest technologies and tools that make reading an interactive and enjoyable experience.
        </p>
        
        <blockquote style="margin: 3rem 0; padding: 2rem; background: rgba(79, 70, 229, 0.1); border-left: 4px solid #4f46e5; font-style: italic;">
          "Digital reading is not merely transferring text from paper to screen, but a real revolution in how we interact with content and knowledge."
        </blockquote>
        
        <h3 style="margin: 2.5rem 0 1.5rem 0; font-size: 1.5rem; font-weight: bold; color: #4f46e5;">
          Features of Digital Reading
        </h3>
        
        <ul style="margin-bottom: 2rem; padding-left: 2rem;">
          <li style="margin-bottom: 1rem;">Ability to customize font size and type</li>
          <li style="margin-bottom: 1rem;">Quick search within text</li>
          <li style="margin-bottom: 1rem;">Add bookmarks and notes</li>
          <li style="margin-bottom: 1rem;">Sync progress across different devices</li>
          <li style="margin-bottom: 1rem;">AI technologies for smart recommendations</li>
        </ul>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          This system also includes many interactive features such as changing themes (light, dark, sepia, night), customizing spacing and margins, and full Arabic language support with right-to-left direction.
        </p>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          Enjoy this reading experience and explore all available features through the toolbar at the top. You can use arrows to navigate between pages, or click the menu button to display the table of contents.
        </p>
        
        <div style="margin: 3rem 0; padding: 2rem; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
          <h4 style="margin-bottom: 1rem; color: #16a34a; font-weight: bold;">Tips for Effective Reading:</h4>
          <p style="margin-bottom: 1rem; line-height: 1.6;">
            • Use bookmarks to save important positions<br>
            • Try different themes to find what's most comfortable for your eyes<br>
            • Take advantage of search feature to find specific information<br>
            • Adjust font size and margins according to your comfort
          </p>
        </div>
      </div>
    `);
  };

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
      setCurrentPage(1);
      // Regenerate content for new chapter
      setTimeout(() => {
        if (chapters[currentChapter + 1]) {
          // Update content based on current chapter
          const currentChapterData = chapters[currentChapter + 1];
          // This would typically load new chapter content
          generateSampleContent();
        }
      }, 100);
    }
  }, [currentPage, totalPages, currentChapter, chapters.length]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      setCurrentPage(totalPages);
      // Regenerate content for new chapter
      setTimeout(() => {
        generateSampleContent();
      }, 100);
    }
  }, [currentPage, currentChapter, totalPages]);

  const goToChapter = (chapterIndex: number) => {
    setCurrentChapter(chapterIndex);
    setCurrentPage(1);
    setShowTOC(false);
    setTimeout(() => {
      generateSampleContent();
    }, 100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      chapter: chapters[currentChapter]?.title || `Chapter ${currentChapter + 1}`,
      position: currentPage,
      timestamp: Date.now(),
      note: ''
    };
    
    const updatedBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(updatedBookmarks);
  };

  const removeBookmark = (bookmarkId: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    saveBookmarks(updatedBookmarks);
  };

  const searchInBook = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Mock search results - in real implementation, search through actual content
    const mockResults = [
      { chapter: 'Chapter One', position: 15, context: 'First search result containing...' },
      { chapter: 'Chapter Two', position: 23, context: 'Another result containing the searched text...' }
    ];
    setSearchResults(mockResults);
  };

  const updateSettings = (key: keyof ReadingSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getReaderStyles = () => {
    const theme = themes[settings.theme];
    return {
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: `${settings.fontSize}px`,
      fontFamily: settings.fontFamily,
      lineHeight: settings.lineHeight,
      direction: (settings.rtl ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
      padding: `${settings.margin}px`,
      maxWidth: `${settings.maxWidth}px`,
      margin: '0 auto',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    };
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">Loading book...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Error</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={loadBook}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Close Book"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Table of Contents"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Search in Book"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button
            onClick={addBookmark}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Add Bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {chapters[currentChapter]?.title || `Chapter ${currentChapter + 1}`}
            </span>
            <span className="text-xs text-gray-500">
              ({currentPage} of {totalPages})
            </span>
          </div>
          
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Reading Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Table of Contents Sidebar */}
        {showTOC && (
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Table of Contents</h3>
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentChapter
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    style={{ paddingLeft: `${chapter.level * 1}rem` }}
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
              
              {bookmarks.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Bookmarks</h4>
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{bookmark.chapter}</div>
                          <div className="text-xs text-gray-500">Page {bookmark.position}</div>
                        </div>
                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Sidebar */}
        {showSearch && (
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Search in Book</h3>
              <input
                type="text"
                placeholder="Search for text..."
                value={searchQuery}
                onChange={(e) => searchInBook(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">{result.chapter}</div>
                      <div className="text-xs text-gray-500 mb-2">Page {result.position}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{result.context}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Reading Settings</h3>
              
              {/* Font Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => updateSettings('fontSize', Math.max(12, settings.fontSize - 2))}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={settings.fontSize}
                    onChange={(e) => updateSettings('fontSize', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    onClick={() => updateSettings('fontSize', Math.min(32, settings.fontSize + 2))}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSettings('fontFamily', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>

              {/* Theme */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => updateSettings('theme', key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        settings.theme === key 
                          ? 'border-purple-500 ring-2 ring-purple-200' 
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: theme.background, color: theme.text }}
                    >
                      <div className="text-sm font-medium">
                        {key === 'light' && 'Light'}
                        {key === 'dark' && 'Dark'}
                        {key === 'sepia' && 'Sepia'}
                        {key === 'night' && 'Night'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Line Height: {settings.lineHeight}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.5"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSettings('lineHeight', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Margins */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Margins: {settings.margin}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={settings.margin}
                  onChange={(e) => updateSettings('margin', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Max Width */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text Width: {settings.maxWidth}px
                </label>
                <input
                  type="range"
                  min="600"
                  max="1200"
                  value={settings.maxWidth}
                  onChange={(e) => updateSettings('maxWidth', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* RTL Toggle */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.rtl}
                    onChange={(e) => updateSettings('rtl', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Right to Left Text</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Book Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Reading Area */}
          <div 
            className="h-full overflow-y-auto"
            style={getReaderStyles()}
            onClick={() => {
              setShowSettings(false);
              setShowTOC(false);
              setShowSearch(false);
            }}
          >
            <div
              ref={readerRef}
              dangerouslySetInnerHTML={{ __html: bookContent }}
              className="min-h-full"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={previousPage}
            disabled={currentChapter === 0 && currentPage === 1}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            {settings.rtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          <button
            onClick={nextPage}
            disabled={currentChapter === chapters.length - 1 && currentPage === totalPages}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Page"
          >
            {settings.rtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => {
              setCurrentChapter(0);
              setCurrentPage(1);
              setTimeout(() => generateSampleContent(), 100);
            }}
            className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Start</span>
          </button>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Chapter {currentChapter + 1} of {chapters.length} • Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Fullscreen
          </button>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {title} • {author}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
