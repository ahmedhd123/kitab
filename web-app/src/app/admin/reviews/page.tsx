'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Review {
  _id: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  bookId: {
    _id: string;
    title: string;
    author: string;
  };
}

interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<ReviewPagination>({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    bookId: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.bookId && { bookId: filters.bookId })
      });

      const response = await fetch(`http://localhost:5000/api/admin/reviews?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل بيانات المراجعات');
      }

      const data = await response.json();
      setReviews(data.data.reviews);
      setPagination(data.data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReviewStatus = async (reviewId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة المراجعة');
      }

      // Update local state
      setReviews(prev => prev.map(review => 
        review._id === reviewId ? { ...review, status: status as any } : review
      ));
      
      // Show success message
      const statusLabels = {
        approved: 'موافق عليها',
        rejected: 'مرفوضة',
        pending: 'في الانتظار'
      };
      alert(`تم تحديث حالة المراجعة إلى: ${statusLabels[status as keyof typeof statusLabels]}`);
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في حذف المراجعة');
      }

      // Remove from local state
      setReviews(prev => prev.filter(review => review._id !== reviewId));
      alert('تم حذف المراجعة بنجاح');
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      approved: 'موافق عليه',
      pending: 'في الانتظار',
      rejected: 'مرفوض'
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
    <AdminLayout>
      <div className="rtl">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">إدارة المراجعات</h1>
                <p className="text-gray-600 mt-1">مراجعة وإدارة تعليقات المستخدمين على الكتب</p>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">كل الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
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

            <div className="flex items-end">
              <button
                onClick={() => fetchReviews()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تحديث
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{pagination.totalReviews}</div>
              <div className="text-sm text-gray-600">إجمالي المراجعات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reviews.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">موافق عليها</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {reviews.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">في الانتظار</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {reviews.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">مرفوضة</div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 space-x-reverse mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{review.bookId.title}</h3>
                      <span className="text-sm text-gray-500">بواسطة {review.bookId.author}</span>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                      <span>المراجع: {review.userId.name}</span>
                      <span>التاريخ: {formatDate(review.createdAt)}</span>
                      {renderStars(review.rating)}
                      <span>({review.rating}/5)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.content}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2 space-x-reverse">
                    {review.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateReviewStatus(review._id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        موافقة
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateReviewStatus(review._id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        رفض
                      </button>
                    )}
                    {review.status !== 'pending' && (
                      <button
                        onClick={() => handleUpdateReviewStatus(review._id, 'pending')}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                      >
                        في الانتظار
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      حذف
                    </button>
                  </div>
                  
                  <div className="flex space-x-4 space-x-reverse text-sm text-gray-500">
                    <Link 
                      href={`/book/${review.bookId._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      عرض الكتاب
                    </Link>
                    <Link 
                      href={`/profile/${review.userId._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      عرض المستخدم
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow mt-6 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                    {Math.min(pagination.currentPage * filters.limit, pagination.totalReviews)}
                  </span>
                  {' '}من{' '}
                  <span className="font-medium">{pagination.totalReviews}</span>
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

        {/* Empty State */}
        {reviews.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مراجعات</h3>
            <p className="text-gray-600">لم يتم العثور على مراجعات تطابق المعايير المحددة</p>
          </div>
        )}
      </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviewsPage;
