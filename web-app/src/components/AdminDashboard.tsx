'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  DocumentPlusIcon,
  UserPlusIcon,
  StarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalReviews: number;
  totalDownloads: number;
  booksThisMonth: number;
  usersThisMonth: number;
  reviewsThisMonth: number;
  downloadsThisMonth: number;
  recentActivity: Activity[];
  topBooks: TopBook[];
  chartData: {
    downloads: { month: string; count: number }[];
    users: { month: string; count: number }[];
  };
}

interface Activity {
  id: string;
  type: string;
  title: string;
  user: string;
  timestamp: string;
  icon: string;
}

interface TopBook {
  id: string;
  title: string;
  author: string;
  downloads: number;
  rating: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-EG').format(num);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'book_added':
        return <DocumentPlusIcon className="w-5 h-5 text-blue-500" />;
      case 'user_registered':
        return <UserPlusIcon className="w-5 h-5 text-green-500" />;
      case 'review_posted':
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
      case 'book_downloaded':
        return <ArrowDownTrayIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <EyeIcon className="w-5 h-5 text-gray-500" />;
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 rtl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">خطأ في تحميل البيانات</p>
            <button 
              onClick={fetchDashboardStats}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="rtl">
      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Books */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">إجمالي الكتب</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(stats.totalBooks)}</dd>
                </dl>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="w-4 h-4 ml-1" />
                +{stats.booksThisMonth}
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">إجمالي المستخدمين</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(stats.totalUsers)}</dd>
                </dl>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="w-4 h-4 ml-1" />
                +{stats.usersThisMonth}
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">إجمالي المراجعات</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(stats.totalReviews)}</dd>
                </dl>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="w-4 h-4 ml-1" />
                +{stats.reviewsThisMonth}
              </div>
            </div>
          </div>

          {/* Total Downloads */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownTrayIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">إجمالي التحميلات</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(stats.totalDownloads)}</dd>
                </dl>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="w-4 h-4 ml-1" />
                +{formatNumber(stats.downloadsThisMonth)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">النشاط الأخير</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {stats.recentActivity.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== stats.recentActivity.length - 1 ? (
                          <span
                            className="absolute top-4 right-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3 space-x-reverse">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 space-x-reverse">
                            <div>
                              <p className="text-sm text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500">بواسطة {activity.user}</p>
                            </div>
                            <div className="text-left text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Top Books */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">أفضل الكتب</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.topBooks.map((book, index) => (
                  <div key={book.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium text-gray-900">{book.title}</p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center text-sm text-gray-500">
                        <StarIcon className="w-4 h-4 text-yellow-400 ml-1" />
                        {book.rating.toFixed(1)}
                      </div>
                      <p className="text-xs text-gray-500">{formatNumber(book.downloads)} تحميل</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link
              href="/admin/books/new"
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              <DocumentPlusIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">إضافة كتاب جديد</span>
            </Link>
            
            <Link
              href="/admin/users"
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              <UserGroupIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">إدارة المستخدمين</span>
            </Link>
            
            <Link
              href="/admin/reviews"
              className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 transition-colors text-center"
            >
              <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">مراجعة التعليقات</span>
            </Link>
            
            <Link
              href="/admin/analytics"
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              <ChartBarIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">التحليلات</span>
            </Link>
            
            <Link
              href="/admin/settings"
              className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              <EyeIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">الإعدادات</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
