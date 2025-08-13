'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  BookOpenIcon,
  StarIcon,
  UserIcon,
  CalendarIcon,
  LanguageIcon,
  DocumentTextIcon,
  TagIcon,
  CloudArrowDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface BookFile {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  language: string;
  publishYear?: number;
  isbn?: {
    isbn10?: string;
    isbn13?: string;
  } | string;
  pages?: number;
  publisher?: string;
  tags: string[];
  status: 'draft' | 'published' | 'pending';
  isFree: boolean;
  price: number;
  rating?: number;
  reviewCount?: number;
  downloadCount?: number;
  files?: {
    epub?: BookFile;
    mobi?: BookFile;
    pdf?: BookFile;
    audiobook?: BookFile;
  };
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
}

const BookDetailsPage = () => {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBook(data.success ? data.data : data);
      } else {
        setError('فشل في تحميل تفاصيل الكتاب');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'منشور';
      case 'draft':
        return 'مسودة';
      case 'pending':
        return 'في انتظار المراجعة';
      default:
        return status;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="w-5 h-5 text-gray-300" />
        )
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !book) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لم يتم العثور على الكتاب</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'الكتاب غير موجود'}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="rtl max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4 space-x-reverse">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-20 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 ml-1" />
                      {book.author}
                    </div>
                    {book.publishYear && (
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 ml-1" />
                        {book.publishYear}
                      </div>
                    )}
                    <div className="flex items-center">
                      <LanguageIcon className="w-4 h-4 ml-1" />
                      {book.language === 'arabic' ? 'العربية' : book.language}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {getStatusText(book.status)}
                    </span>
                    {book.isFree ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        مجاني
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {book.price} ريال
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <PencilIcon className="w-4 h-4 ml-1" />
                  تعديل
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center">
                  <EyeIcon className="w-4 h-4 ml-1" />
                  معاينة
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
                  <TrashIcon className="w-4 h-4 ml-1" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 ml-2" />
                وصف الكتاب
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {book.description || 'لا يوجد وصف متاح'}
              </p>
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TagIcon className="w-5 h-5 ml-2" />
                  الكلمات المفتاحية
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {book.files && Object.keys(book.files).length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CloudArrowDownIcon className="w-5 h-5 ml-2" />
                  ملفات الكتاب
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(book.files).map(([format, file]) => (
                    <div key={format} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 uppercase">{format}</h3>
                          <p className="text-sm text-gray-500">{file.originalName}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                        </div>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          تحميل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h2>
              <div className="space-y-4">
                {book.rating && (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">التقييم</span>
                      <div className="flex items-center">
                        <div className="flex">
                          {renderStars(book.rating)}
                        </div>
                        <span className="mr-2 text-sm text-gray-600">
                          ({book.reviewCount || 0} مراجعة)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {book.downloadCount !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">التحميلات</span>
                    <span className="text-sm font-medium text-gray-900">
                      {book.downloadCount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">تاريخ الإضافة</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(book.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">آخر تحديث</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(book.updatedAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات الكتاب</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">النوع</span>
                  <span className="text-sm font-medium text-gray-900">{book.genre}</span>
                </div>
                
                {book.isbn && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ISBN</span>
                    <span className="text-sm font-medium text-gray-900">
                      {typeof book.isbn === 'string' ? book.isbn : (book.isbn?.isbn13 || book.isbn?.isbn10 || 'غير محدد')}
                    </span>
                  </div>
                )}
                
                {book.pages && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">عدد الصفحات</span>
                    <span className="text-sm font-medium text-gray-900">{book.pages}</span>
                  </div>
                )}
                
                {book.publisher && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">دار النشر</span>
                    <span className="text-sm font-medium text-gray-900">{book.publisher}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BookDetailsPage;
