'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Headphones,
  Book,
  HardDrive
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

interface UploadProgress {
  format: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

export default function BookFileManager({ bookId }: { bookId: string }) {
  const [files, setFiles] = useState<BookFiles>({});
  const [uploading, setUploading] = useState<UploadProgress[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const formatIcons = {
    epub: <Book className="w-5 h-5 text-green-600" />,
    mobi: <FileText className="w-5 h-5 text-blue-600" />,
    pdf: <File className="w-5 h-5 text-red-600" />,
    audiobook: <Headphones className="w-5 h-5 text-purple-600" />
  };

  const formatLabels = {
    epub: 'EPUB',
    mobi: 'MOBI', 
    pdf: 'PDF',
    audiobook: 'كتاب صوتي'
  };

  const formatDescriptions = {
    epub: 'أفضل للقراءة على الأجهزة المحمولة والتابلت',
    mobi: 'مُحسن لأجهزة Kindle',
    pdf: 'يحافظ على التنسيق الأصلي',
    audiobook: 'للاستماع أثناء التنقل'
  };

  // Load existing files
  useEffect(() => {
    fetchBookFiles();
  }, [bookId]);

  const fetchBookFiles = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
      const data = await response.json();
      
      if (data.success && data.data.digitalFiles) {
        setFiles(data.data.digitalFiles);
      }
    } catch (error) {
      console.error('Error fetching book files:', error);
    }
  };

  const handleFileUpload = async (file: File, format: string) => {
    const formData = new FormData();
    formData.append('bookFile', file);

    // Add progress tracking
    const uploadProgress: UploadProgress = {
      format,
      progress: 0,
      status: 'uploading'
    };
    
    setUploading(prev => [...prev, uploadProgress]);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploading(prev => 
            prev.map(up => 
              up.format === format 
                ? { ...up, progress }
                : up
            )
          );
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploading(prev => 
            prev.map(up => 
              up.format === format 
                ? { ...up, status: 'success', progress: 100, message: response.message }
                : up
            )
          );
          
          // Refresh files list
          setTimeout(() => {
            fetchBookFiles();
            setUploading(prev => prev.filter(up => up.format !== format));
          }, 2000);
        } else {
          const error = JSON.parse(xhr.responseText);
          setUploading(prev => 
            prev.map(up => 
              up.format === format 
                ? { ...up, status: 'error', message: error.message }
                : up
            )
          );
        }
      };

      xhr.onerror = () => {
        setUploading(prev => 
          prev.map(up => 
            up.format === format 
              ? { ...up, status: 'error', message: 'خطأ في الشبكة' }
              : up
          )
        );
      };

      xhr.open('POST', `/api/books/${bookId}/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);

    } catch (error) {
      setUploading(prev => 
        prev.map(up => 
          up.format === format 
            ? { ...up, status: 'error', message: 'خطأ في رفع الملف' }
            : up
        )
      );
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    
    droppedFiles.forEach(file => {
      const format = getFileFormat(file.name);
      if (format) {
        handleFileUpload(file, format);
      } else {
        alert(`صيغة الملف غير مدعومة: ${file.name}`);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    selectedFiles.forEach(file => {
      const format = getFileFormat(file.name);
      if (format) {
        handleFileUpload(file, format);
      } else {
        alert(`صيغة الملف غير مدعومة: ${file.name}`);
      }
    });
  };

  const getFileFormat = (filename: string): string | null => {
    const ext = filename.toLowerCase().split('.').pop();
    
    switch (ext) {
      case 'epub': return 'epub';
      case 'mobi': return 'mobi';
      case 'pdf': return 'pdf';
      case 'mp3':
      case 'm4a':
      case 'wav': return 'audiobook';
      default: return null;
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    if (bytes === 0) return '0 بايت';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (format: string) => {
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
        a.download = `book.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Refresh to update download count
        fetchBookFiles();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('خطأ في تحميل الملف');
    }
  };

  const handleDelete = async (format: string) => {
    if (!confirm(`هل أنت متأكد من حذف ملف ${formatLabels[format as keyof typeof formatLabels]}؟`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}/files/${format}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setFiles(prev => ({
          ...prev,
          [format]: undefined
        }));
        alert('تم حذف الملف بنجاح');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('خطأ في حذف الملف');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">إدارة ملفات الكتاب</h2>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
          dragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">رفع ملفات الكتاب</h3>
        <p className="text-gray-600 mb-4">
          اسحب الملفات هنا أو انقر للاختيار
        </p>
        <input
          type="file"
          multiple
          accept=".epub,.mobi,.pdf,.mp3,.m4a,.wav"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
        >
          اختيار الملفات
        </label>
        <p className="text-xs text-gray-500 mt-2">
          الصيغ المدعومة: EPUB, MOBI, PDF, MP3, M4A, WAV
        </p>
      </div>

      {/* Upload Progress */}
      {uploading.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="font-medium text-gray-900 text-right">جاري الرفع:</h3>
          {uploading.map((upload, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {formatIcons[upload.format as keyof typeof formatIcons]}
                  <span className="font-medium">{formatLabels[upload.format as keyof typeof formatLabels]}</span>
                </div>
                <span className="text-sm text-gray-600">{upload.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    upload.status === 'error' ? 'bg-red-500' : 
                    upload.status === 'success' ? 'bg-green-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
              {upload.message && (
                <p className={`text-sm ${
                  upload.status === 'error' ? 'text-red-600' : 
                  upload.status === 'success' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {upload.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 text-right">الملفات المتاحة:</h3>
        
        {Object.entries(formatLabels).map(([format, label]) => {
          const file = files[format as keyof BookFiles];
          
          return (
            <div key={format} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formatIcons[format as keyof typeof formatIcons]}
                  <div>
                    <h4 className="font-medium text-gray-900">{label}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDescriptions[format as keyof typeof formatDescriptions]}
                    </p>
                    {file && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(file.fileSize)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {file.downloadCount} تحميل
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {file ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <button
                        onClick={() => handleDownload(format)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="تحميل"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(format)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 text-right">نصائح لرفع الملفات:</h4>
        <ul className="text-sm text-blue-800 space-y-1 text-right">
          <li>• يمكن رفع عدة صيغ للكتاب الواحد لتوفير خيارات أكثر للقراء</li>
          <li>• ملفات EPUB تعمل بشكل أفضل على معظم أجهزة القراءة</li>
          <li>• ملفات MOBI مُحسنة لأجهزة Amazon Kindle</li>
          <li>• الحد الأقصى لحجم الملف: 100 ميجابايت</li>
          <li>• يُنصح بضغط الملفات الكبيرة قبل الرفع</li>
        </ul>
      </div>
    </div>
  );
}
