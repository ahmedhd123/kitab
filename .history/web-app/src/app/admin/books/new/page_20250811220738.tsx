'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ToastProvider';
import {
  BookOpenIcon,
  PhotoIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  PlusIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface BookForm {
  title: string;
  author: string;
  description: string;
  genre: string;
  language: string;
  publishYear: string;
  isbn: string;
  pages: string;
  publisher: string;
  tags: string[];
  status: 'draft' | 'published' | 'pending';
  isFree: boolean;
  price: string;
  coverImage?: File;
  files: {
    epub?: File;
    mobi?: File;
    pdf?: File;
    audiobook?: File;
  };
}

const NewBookPage = () => {
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [formData, setFormData] = useState<BookForm>({
    title: '',
    author: '',
    description: '',
    genre: '',
    language: 'arabic',
    publishYear: '',
    isbn: '',
    pages: '',
    publisher: '',
    tags: [],
    status: 'draft',
    isFree: true,
    price: '0',
    files: {}
  });

  const genres = [
    'الأدب العربي',
    'الأدب العالمي',
    'التاريخ',
    'الفلسفة',
    'العلوم',
    'الشعر',
    'السيرة الذاتية',
    'الدين',
    'السياسة',
    'الاقتصاد',
    'التكنولوجيا',
    'الطب',
    'الطبخ',
    'الرياضة',
    'الفنون',
    'الأطفال',
    'الشباب',
    'الخيال العلمي',
    'الغموض والإثارة',
    'الرومانسية'
  ];

  const languages = [
    { value: 'arabic', label: 'العربية' },
    { value: 'english', label: 'الإنجليزية' },
    { value: 'french', label: 'الفرنسية' },
    { value: 'german', label: 'الألمانية' },
    { value: 'spanish', label: 'الإسبانية' },
    { value: 'other', label: 'أخرى' }
  ];

  const handleInputChange = (field: keyof BookForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (fileType: string, file: File | null) => {
    if (fileType === 'coverImage') {
      setFormData(prev => ({
        ...prev,
        coverImage: file || undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [fileType]: file || undefined
        }
      }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add basic form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'files' || key === 'coverImage') return;
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, String(value));
        }
      });

      // Add files
      if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      }
      
      Object.entries(formData.files).forEach(([type, file]) => {
        if (file) {
          submitData.append(`files[${type}]`, file);
        }
      });

      // API call (in production)
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });

      if (response.ok) {
        router.push('/admin/books');
      } else {
        const data = await response.json();
        setError(data.message || 'فشل في إضافة الكتاب');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      setError('حدث خطأ أثناء إضافة الكتاب');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
    handleSubmit(new Event('submit') as any);
  };

  const handlePublish = () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
    handleSubmit(new Event('submit') as any);
  };

  return (
    <AdminLayout>
      <div className="rtl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إضافة كتاب جديد</h1>
              <p className="text-gray-600 mt-2">أضف كتاباً جديداً إلى المكتبة</p>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              العودة
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BookOpenIcon className="w-6 h-6 ml-2" />
              المعلومات الأساسية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الكتاب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل عنوان الكتاب"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المؤلف <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اسم المؤلف"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النوع <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر النوع</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللغة
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              {/* Publish Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سنة النشر
                </label>
                <input
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={formData.publishYear}
                  onChange={(e) => handleInputChange('publishYear', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2023"
                />
              </div>

              {/* ISBN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="978-3-16-148410-0"
                />
              </div>

              {/* Pages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد الصفحات
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.pages}
                  onChange={(e) => handleInputChange('pages', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="250"
                />
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دار النشر
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="دار النشر"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الكتاب <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="وصف مختصر للكتاب ومحتواه"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">الكلمات المفتاحية</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="mr-2 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل كلمة مفتاحية"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">التسعير</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={(e) => handleInputChange('isFree', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isFree" className="mr-2 text-sm font-medium text-gray-700">
                  كتاب مجاني
                </label>
              </div>

              {!formData.isFree && (
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر (ريال سعودي)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <PhotoIcon className="w-6 h-6 ml-2" />
              صورة الغلاف
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {formData.coverImage ? (
                <div className="space-y-4">
                  <img
                    src={URL.createObjectURL(formData.coverImage)}
                    alt="Cover preview"
                    className="mx-auto h-48 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-gray-600">
                      {formData.coverImage.name} ({(formData.coverImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    <button
                      type="button"
                      onClick={() => handleFileChange('coverImage', null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        رفع صورة الغلاف
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, GIF حتى 5MB
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => handleFileChange('coverImage', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book Files */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DocumentArrowUpIcon className="w-6 h-6 ml-2" />
              ملفات الكتاب
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'epub', label: 'EPUB', accept: '.epub' },
                { key: 'mobi', label: 'MOBI', accept: '.mobi' },
                { key: 'pdf', label: 'PDF', accept: '.pdf' },
                { key: 'audiobook', label: 'الكتاب المسموع', accept: '.mp3,.m4a,.wav' }
              ].map(({ key, label, accept }) => (
                <div key={key} className="border border-gray-300 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">{label}</h3>
                  {formData.files[key as keyof typeof formData.files] ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {formData.files[key as keyof typeof formData.files]?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((formData.files[key as keyof typeof formData.files]?.size || 0) / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => handleFileChange(key, null)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        إزالة الملف
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400">
                          <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <span className="mt-2 block text-sm text-gray-600">
                            رفع ملف {label}
                          </span>
                        </div>
                        <input
                          type="file"
                          className="sr-only"
                          accept={accept}
                          onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ كمسودة'}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري النشر...' : 'نشر الكتاب'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewBookPage;
