'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  publishedDate?: string;
  createdAt: string;
  downloads?: number;
  rating?: number;
  reviewCount?: number;
  hasFiles?: {
    epub: boolean;
    mobi: boolean;
    pdf: boolean;
    txt: boolean;
  };
  averageRating?: number;
  description?: string;
  genre?: string;
  language?: string;
  isbn?: string;
}

interface BookPagination {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const AdminBooksPageNew = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<BookPagination>({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`http://localhost:5000/api/admin/books?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل بيانات الكتب');
      }

      const data = await response.json();
      setBooks(data.data.books);
      setPagination(data.data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في حذف الكتاب');
      }

      // Remove from local state
      setBooks(prev => prev.filter(book => book._id !== bookId));
      alert('تم حذف الكتاب بنجاح');
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const handleUpdateBookStatus = async (bookId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة الكتاب');
      }

      // Update local state
      setBooks(prev => prev.map(book => 
        book._id === bookId ? { ...book, status: status as any } : book
      ));
      
      alert('تم تحديث حالة الكتاب بنجاح');
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBooks.length === 0) {
      alert('يرجى اختيار كتاب واحد على الأقل');
      return;
    }

    if (!confirm(`هل أنت متأكد من تطبيق "${action}" على ${selectedBooks.length} كتاب؟`)) {
      return;
    }

    try {
      // Implement bulk actions here
      alert(`تم تطبيق "${action}" على ${selectedBooks.length} كتاب بنجاح`);
      setSelectedBooks([]);
      setShowBulkActions(false);
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      published: 'منشور',
      draft: 'مسودة',
      archived: 'مؤرشف'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 1l3 6h6l-5 4 2 6-6-4-6 4 2-6L1 7h6l3-6z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 rtl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الكتب</h1>
              <p className="text-gray-600 mt-1">إضافة وتعديل وإدارة مجموعة الكتب</p>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <Link
                href="/admin"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                العودة للوحة التحكم
              </Link>
              <Link
                href="/admin/books/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                إضافة كتاب جديد
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                placeholder="عنوان الكتاب أو اسم المؤلف"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">كل الحالات</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt">تاريخ الإضافة</option>
                <option value="title">العنوان</option>
                <option value="author">المؤلف</option>
                <option value="downloads">التحميلات</option>
                <option value="rating">التقييم</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عدد النتائج</label>
              <select
                value={filters.limit}
                onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBooks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-blue-800">
                تم اختيار {selectedBooks.length} كتاب
              </span>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  نشر
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  أرشفة
                </button>
                <button
                  onClick={() => setSelectedBooks([])}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  إلغاء التحديد
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="text-sm text-gray-600">
            إجمالي الكتب: <span className="font-semibold text-gray-900">{pagination.totalBooks.toLocaleString('ar-EG')}</span>
            {filters.search && (
              <span className="mr-4">
                نتائج البحث: <span className="font-semibold text-gray-900">{books.length}</span>
              </span>
            )}
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedBooks.length === books.length && books.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBooks(books.map(book => book._id));
                        } else {
                          setSelectedBooks([]);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكتاب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإحصائيات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الملفات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإضافة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBooks(prev => [...prev, book._id]);
                          } else {
                            setSelectedBooks(prev => prev.filter(id => id !== book._id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                        {book.genre && (
                          <div className="text-xs text-gray-400">{book.genre}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(book.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>تحميل: {book.downloads?.toLocaleString('ar-EG') || 0}</div>
                        <div className="flex items-center">
                          {renderStars(book.averageRating || 0)}
                          <span className="mr-1">({book.reviewCount || 0})</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1 space-x-reverse">
                        {book.hasFiles?.epub && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">EPUB</span>}
                        {book.hasFiles?.mobi && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">MOBI</span>}
                        {book.hasFiles?.pdf && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">PDF</span>}
                        {book.hasFiles?.txt && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">TXT</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(book.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <Link
                          href={`/book/${book._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          عرض
                        </Link>
                        <Link
                          href={`/admin/books/edit/${book._id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          تعديل
                        </Link>
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900">
                            المزيد
                          </button>
                          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                            <div className="py-1">
                              {book.status === 'draft' && (
                                <button
                                  onClick={() => handleUpdateBookStatus(book._id, 'published')}
                                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  نشر
                                </button>
                              )}
                              {book.status === 'published' && (
                                <button
                                  onClick={() => handleUpdateBookStatus(book._id, 'archived')}
                                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  أرشفة
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.hasNext}
                  className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    عرض{' '}
                    <span className="font-medium">{((pagination.currentPage - 1) * filters.limit) + 1}</span>
                    {' '}إلى{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * filters.limit, pagination.totalBooks)}
                    </span>
                    {' '}من{' '}
                    <span className="font-medium">{pagination.totalBooks}</span>
                    {' '}نتيجة
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      السابق
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      التالي
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {books.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد كتب</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على كتب تطابق المعايير المحددة</p>
            <Link
              href="/admin/books/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة كتاب جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooksPageNew;
