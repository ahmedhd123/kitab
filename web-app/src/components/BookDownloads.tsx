'use client';

import { useState } from 'react';
import { 
  Download, 
  Book, 
  FileText, 
  File, 
  Headphones,
  HardDrive,
  Clock,
  Lock,
  Check,
  Star
} from 'lucide-react';

interface DigitalFile {
  available: boolean;
  fileSize: number;
  uploadDate: string;
  downloadCount: number;
}

interface BookFiles {
  epub?: DigitalFile;
  mobi?: DigitalFile;
  pdf?: DigitalFile;
  audiobook?: DigitalFile;
}

interface BookDownloadsProps {
  bookId: string;
  bookTitle: string;
  digitalFiles: BookFiles;
  userHasAccess?: boolean;
  isPremium?: boolean;
}

export default function BookDownloads({ 
  bookId, 
  bookTitle, 
  digitalFiles, 
  userHasAccess = true,
  isPremium = false 
}: BookDownloadsProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const formatIcons = {
    epub: <Book className="w-6 h-6 text-green-600" />,
    mobi: <FileText className="w-6 h-6 text-blue-600" />,
    pdf: <File className="w-6 h-6 text-red-600" />,
    audiobook: <Headphones className="w-6 h-6 text-purple-600" />
  };

  const formatLabels = {
    epub: 'EPUB',
    mobi: 'MOBI',
    pdf: 'PDF',
    audiobook: 'كتاب صوتي'
  };

  const formatDescriptions = {
    epub: 'مثالي للهواتف والتابلت - يتكيف مع حجم الشاشة',
    mobi: 'متوافق مع أجهزة Kindle - تجربة قراءة محسنة',
    pdf: 'يحافظ على التصميم الأصلي - أفضل للطباعة',
    audiobook: 'استمع أثناء التنقل - رواية احترافية'
  };

  const formatFeatures = {
    epub: ['تغيير حجم الخط', 'وضع ليلي', 'بحث النص', 'إشارات مرجعية'],
    mobi: ['تحسين Kindle', 'معجم مدمج', 'مزامنة التقدم', 'إبراز النص'],
    pdf: ['جودة طباعة عالية', 'تصميم ثابت', 'ملاحظات PDF', 'عرض صفحات'],
    audiobook: ['سرعة قابلة للتعديل', 'إشارات مرجعية صوتية', 'وضع السكون', 'فصول منظمة']
  };

  const deviceCompatibility = {
    epub: ['Android', 'iPhone/iPad', 'Windows', 'Mac', 'معظم القارئات'],
    mobi: ['Kindle', 'Android (Kindle App)', 'iPhone/iPad (Kindle App)', 'Windows'],
    pdf: ['جميع الأجهزة', 'متصفحات الويب', 'طابعات', 'أجهزة الكمبيوتر'],
    audiobook: ['هواتف ذكية', 'سماعات Bluetooth', 'مكبرات الصوت', 'أنظمة السيارات']
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    if (bytes === 0) return '0 بايت';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (format: string) => {
    if (!userHasAccess) {
      alert('يجب تسجيل الدخول أولاً لتحميل الكتب');
      return;
    }

    setDownloading(format);

    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}/download/${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${bookTitle.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Show success message
        alert('تم بدء التحميل بنجاح!');
      } else {
        const error = await response.json();
        alert(error.message || 'حدث خطأ أثناء التحميل');
      }
    } catch (error) {
      alert('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    } finally {
      setDownloading(null);
    }
  };

  const availableFormats = Object.entries(digitalFiles).filter(([_, file]) => file?.available);

  if (availableFormats.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ملفات رقمية</h3>
        <p className="text-gray-600">
          هذا الكتاب غير متوفر حالياً بصيغة رقمية. تحقق لاحقاً أو تواصل معنا لطلب إضافته.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تحميل الكتاب</h2>
            <p className="text-gray-600">
              متوفر بـ {availableFormats.length} صيغة مختلفة
            </p>
          </div>
          {isPremium && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm">
              <Star className="w-4 h-4" />
              كتاب مميز
            </div>
          )}
        </div>
      </div>

      {/* Download Options */}
      <div className="p-6 space-y-6">
        {availableFormats.map(([format, file]) => (
          <div key={format} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {formatIcons[format as keyof typeof formatIcons]}
                </div>
                
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-end mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {formatLabels[format as keyof typeof formatLabels]}
                    </h3>
                    {userHasAccess && <Check className="w-5 h-5 text-green-500" />}
                    {!userHasAccess && <Lock className="w-5 h-5 text-gray-400" />}
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {formatDescriptions[format as keyof typeof formatDescriptions]}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 justify-end mb-3">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-4 h-4" />
                      {formatFileSize(file.fileSize)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {file.downloadCount} تحميل
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(file.uploadDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(format)}
                disabled={!userHasAccess || downloading === format}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  userHasAccess
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {downloading === format ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    تحميل
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3 text-right">المميزات:</h4>
              <div className="grid grid-cols-2 gap-2">
                {formatFeatures[format as keyof typeof formatFeatures].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Compatibility */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-right">متوافق مع:</h4>
              <div className="flex flex-wrap gap-2 justify-end">
                {deviceCompatibility[format as keyof typeof deviceCompatibility].map((device, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="text-center">
          <h4 className="font-medium text-gray-900 mb-2">مشاكل في التحميل؟</h4>
          <p className="text-sm text-gray-600 mb-3">
            إذا واجهت أي مشكلة في تحميل الكتاب، يرجى التواصل معنا
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/contact"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              تواصل معنا
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/help/downloads"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              مساعدة التحميل
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
