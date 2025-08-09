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
          const chapters = extractChaptersFromText(textContent);
          setChapters(chapters);
          setTotalPages(chapters.length);
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
    const chapters: Chapter[] = [];
    let chapterIndex = 1;

    lines.forEach((line, index) => {
      if (line.includes('الفصل') || line.startsWith('الفصل')) {
        chapters.push({
          id: chapterIndex.toString(),
          title: line.trim(),
          href: `#chapter-${chapterIndex}`,
          level: 1
        });
        chapterIndex++;
      }
    });

    return chapters.length > 0 ? chapters : [
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
      
      // Load book content based on format
      if (format === 'epub') {
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

  const loadEpubContent = async (url: string) => {
    // For demo purposes, we'll generate structured content
    // In a real implementation, you'd use epub.js library
    const sampleChapters: Chapter[] = [
      { id: '1', title: 'المقدمة', href: '#chapter-1', level: 1 },
      { id: '2', title: 'الفصل الأول: البداية', href: '#chapter-2', level: 1 },
      { id: '3', title: 'الفصل الثاني: التطور', href: '#chapter-3', level: 1 },
      { id: '4', title: 'الفصل الثالث: الذروة', href: '#chapter-4', level: 1 },
      { id: '5', title: 'الخاتمة', href: '#chapter-5', level: 1 }
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
      { id: '1', title: 'مقدمة الكتاب', href: '#chapter-1', level: 1 },
      { id: '2', title: 'الفصل الأول: مفهوم القراءة الرقمية', href: '#chapter-2', level: 1 },
      { id: '3', title: 'التكنولوجيا والكتب', href: '#chapter-3', level: 2 },
      { id: '4', title: 'الفصل الثاني: مستقبل النشر', href: '#chapter-4', level: 1 },
      { id: '5', title: 'الذكاء الاصطناعي في القراءة', href: '#chapter-5', level: 2 },
      { id: '6', title: 'الخاتمة والتوصيات', href: '#chapter-6', level: 1 }
    ];
    
    setChapters(sampleChapters);
    setTotalPages(sampleChapters.length);
    
    setBookContent(`
      <div class="book-content" id="chapter-${currentChapter + 1}">
        <h1 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem; font-weight: bold;">${title}</h1>
        <h2 style="text-align: center; color: #666; margin-bottom: 4rem; font-size: 1.5rem;">بقلم: ${author}</h2>
        
        <h2 style="margin: 3rem 0 2rem 0; font-size: 2rem; font-weight: bold; color: #4f46e5;">
          ${sampleChapters[currentChapter]?.title || 'الفصل الحالي'}
        </h2>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          في عالم اليوم المتسارع، تحولت القراءة من كونها مجرد نشاط ترفيهي إلى ضرورة حياتية وأداة أساسية للتعلم والنمو الشخصي. 
          ومع التطور التكنولوجي الهائل، ظهرت الكتب الإلكترونية كحل مبتكر يجمع بين سهولة الوصول وثراء المحتوى.
        </p>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          هذا الكتاب الرقمي يستكشف عالم القراءة الإلكترونية ويقدم رؤية شاملة حول مستقبل النشر والتعلم الرقمي. 
          من خلال صفحاته، ستتعرف على أحدث التقنيات والأدوات التي تجعل القراءة تجربة تفاعلية وممتعة.
        </p>
        
        <blockquote style="margin: 3rem 0; padding: 2rem; background: rgba(79, 70, 229, 0.1); border-right: 4px solid #4f46e5; font-style: italic;">
          "القراءة الرقمية ليست مجرد نقل للنص من الورق إلى الشاشة، بل هي ثورة حقيقية في طريقة تفاعلنا مع المحتوى والمعرفة."
        </blockquote>
        
        <h3 style="margin: 2.5rem 0 1.5rem 0; font-size: 1.5rem; font-weight: bold; color: #4f46e5;">
          ميزات القراءة الرقمية
        </h3>
        
        <ul style="margin-bottom: 2rem; padding-right: 2rem;">
          <li style="margin-bottom: 1rem;">إمكانية تخصيص حجم ونوع الخط</li>
          <li style="margin-bottom: 1rem;">البحث السريع داخل النص</li>
          <li style="margin-bottom: 1rem;">إضافة العلامات المرجعية والملاحظات</li>
          <li style="margin-bottom: 1rem;">مزامنة التقدم عبر الأجهزة المختلفة</li>
          <li style="margin-bottom: 1rem;">تقنيات الذكاء الاصطناعي للتوصيات الذكية</li>
        </ul>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          كما يتضمن هذا النظام العديد من الميزات التفاعلية مثل تغيير الثيمات (فاتح، داكن، بني فاتح، ليلي)، 
          وتخصيص المسافات والهوامش، ودعم اللغة العربية بشكل كامل مع الاتجاه من اليمين إلى اليسار.
        </p>
        
        <p style="margin-bottom: 2rem; text-align: justify; line-height: 1.8;">
          استمتع بتجربة القراءة هذه واستكشف جميع الميزات المتاحة من خلال شريط الأدوات في الأعلى. 
          يمكنك استخدام الأسهم للتنقل بين الصفحات، أو الضغط على زر القائمة لعرض فهرس المحتويات.
        </p>
        
        <div style="margin: 3rem 0; padding: 2rem; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
          <h4 style="margin-bottom: 1rem; color: #16a34a; font-weight: bold;">نصائح للقراءة الفعالة:</h4>
          <p style="margin-bottom: 1rem; line-height: 1.6;">
            • استخدم العلامات المرجعية لحفظ المواضع المهمة<br>
            • جرب الثيمات المختلفة لتجد الأنسب لعينيك<br>
            • استفد من ميزة البحث للعثور على معلومات محددة<br>
            • اضبط حجم الخط والهوامش حسب راحتك
          </p>
        </div>
      </div>
    `);
  };
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
