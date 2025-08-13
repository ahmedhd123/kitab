'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  BookOpen, 
  Check, 
  X, 
  AlertCircle
} from 'lucide-react';

interface BookUploadProps {
  onUploadComplete?: (bookData: any) => void;
}

export default function BookUpload({ onUploadComplete }: BookUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [bookMetadata, setBookMetadata] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    language: 'ar',
    publishYear: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = {
    'application/epub+zip': '.epub',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      Object.keys(allowedTypes).includes(file.type) || 
      file.name.toLowerCase().endsWith('.epub') ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.txt')
    );

    if (validFiles.length !== files.length) {
      alert('بعض الملفات غير مدعومة. الملفات المدعومة: EPUB, PDF, TXT, DOCX');
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Auto-fill metadata from first file
    if (validFiles.length > 0 && !bookMetadata.title) {
      const fileName = validFiles[0].name;
      const titleWithoutExt = fileName.replace(/\.[^/.]+$/, '');
      setBookMetadata(prev => ({
        ...prev,
        title: titleWithoutExt
      }));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <File className="w-6 h-6 text-red-500" />;
    if (file.name.toLowerCase().endsWith('.epub')) return <BookOpen className="w-6 h-6 text-blue-500" />;
    if (file.type.includes('text')) return <FileText className="w-6 h-6 text-green-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const uploadBooks = async () => {
    if (uploadedFiles.length === 0) {
      alert('يرجى اختيار ملف أولاً');
      return;
    }

    if (!bookMetadata.title || !bookMetadata.author) {
      alert('يرجى ملء العنوان واسم المؤلف');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In real implementation, upload to server
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      formData.append('metadata', JSON.stringify(bookMetadata));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete({
          files: uploadedFiles,
          metadata: bookMetadata
        });
      }

      // Reset form
      setTimeout(() => {
        setUploadedFiles([]);
        setBookMetadata({
          title: '',
          author: '',
          description: '',
          genre: '',
          language: 'ar',
          publishYear: ''
        });
        setUploadProgress(0);
        setUploading(false);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ أثناء رفع الكتاب');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">رفع كتاب جديد</h2>
          <p className="text-blue-100">ارفع كتبك الإلكترونية بصيغة EPUB, PDF, أو TXT</p>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".epub,.pdf,.txt,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  اسحب الملفات هنا أو انقر للاختيار
                </p>
                <p className="text-sm text-gray-500">
                  الصيغ المدعومة: EPUB, PDF, TXT, DOCX (حتى 50 ميجابايت)
                </p>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                اختيار الملفات
              </button>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">الملفات المرفوعة</h3>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {getFileIcon(file)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} ميجابايت
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Book Metadata Form */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الكتاب *
              </label>
              <input
                type="text"
                required
                value={bookMetadata.title}
                onChange={(e) => setBookMetadata(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل عنوان الكتاب"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المؤلف *
              </label>
              <input
                type="text"
                required
                value={bookMetadata.author}
                onChange={(e) => setBookMetadata(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اسم المؤلف"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النوع الأدبي
              </label>
              <select
                value={bookMetadata.genre}
                onChange={(e) => setBookMetadata(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر النوع</option>
                <option value="رواية">رواية</option>
                <option value="قصة">قصة</option>
                <option value="شعر">شعر</option>
                <option value="علمي">علمي</option>
                <option value="تاريخ">تاريخ</option>
                <option value="دين">دين</option>
                <option value="فلسفة">فلسفة</option>
                <option value="أدب">أدب</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سنة النشر
              </label>
              <input
                type="number"
                value={bookMetadata.publishYear}
                onChange={(e) => setBookMetadata(prev => ({ ...prev, publishYear: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: 2024"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الكتاب
              </label>
              <textarea
                rows={4}
                value={bookMetadata.description}
                onChange={(e) => setBookMetadata(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="وصف مختصر عن محتوى الكتاب..."
              />
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>جاري الرفع...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
              onClick={uploadBooks}
              disabled={uploading || uploadedFiles.length === 0}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>جاري الرفع...</span>
                </>
              ) : uploadProgress === 100 ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم الرفع بنجاح</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>رفع الكتاب</span>
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">ملاحظات هامة:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>تأكد من أن لديك الحقوق اللازمة لنشر الكتاب</li>
                  <li>الحد الأقصى لحجم الملف 50 ميجابايت</li>
                  <li>سيتم مراجعة الكتاب قبل النشر</li>
                  <li>يمكن رفع عدة ملفات للكتاب الواحد (مثل نسخ مختلفة)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
