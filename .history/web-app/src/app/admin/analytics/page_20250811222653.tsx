'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalBooks: number;
    totalDownloads: number;
    totalReviews: number;
    avgRating: number;
  };
  trends: {
    usersGrowth: number;
    booksGrowth: number;
    downloadsGrowth: number;
    reviewsGrowth: number;
  };
  charts: {
    monthlyUsers: Array<{ month: string; count: number }>;
    monthlyDownloads: Array<{ month: string; count: number }>;
    topGenres: Array<{ genre: string; count: number; percentage: number }>;
    userActivity: Array<{ hour: number; count: number }>;
  };
  topBooks: Array<{
    id: string;
    title: string;
    author: string;
    downloads: number;
    views: number;
    rating: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'download' | 'registration' | 'review' | 'upload';
    description: string;
    timestamp: string;
  }>;
}

const AdminAnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate API call - في الإنتاج سيكون هذا API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات وهمية للعرض
      const analyticsData: AnalyticsData = {
        overview: {
          totalUsers: 2847,
          totalBooks: 1256,
          totalDownloads: 18439,
          totalReviews: 5621,
          avgRating: 4.3
        },
        trends: {
          usersGrowth: 12.5,
          booksGrowth: 8.3,
          downloadsGrowth: 23.7,
          reviewsGrowth: 15.2
        },
        charts: {
          monthlyUsers: [
            { month: 'يناير', count: 145 },
            { month: 'فبراير', count: 178 },
            { month: 'مارس', count: 234 },
            { month: 'أبريل', count: 189 },
            { month: 'مايو', count: 267 },
            { month: 'يونيو', count: 298 }
          ],
          monthlyDownloads: [
            { month: 'يناير', count: 1456 },
            { month: 'فبراير', count: 1789 },
            { month: 'مارس', count: 2134 },
            { month: 'أبريل', count: 1934 },
            { month: 'مايو', count: 2567 },
            { month: 'يونيو', count: 2987 }
          ],
          topGenres: [
            { genre: 'الأدب العربي', count: 456, percentage: 35.2 },
            { genre: 'التاريخ', count: 289, percentage: 22.3 },
            { genre: 'الفلسفة', count: 234, percentage: 18.1 },
            { genre: 'العلوم', count: 178, percentage: 13.7 },
            { genre: 'الشعر', count: 139, percentage: 10.7 }
          ],
          userActivity: [
            { hour: 0, count: 23 }, { hour: 1, count: 12 }, { hour: 2, count: 8 },
            { hour: 3, count: 5 }, { hour: 4, count: 7 }, { hour: 5, count: 15 },
            { hour: 6, count: 45 }, { hour: 7, count: 78 }, { hour: 8, count: 123 },
            { hour: 9, count: 167 }, { hour: 10, count: 189 }, { hour: 11, count: 201 },
            { hour: 12, count: 234 }, { hour: 13, count: 189 }, { hour: 14, count: 156 },
            { hour: 15, count: 178 }, { hour: 16, count: 198 }, { hour: 17, count: 234 },
            { hour: 18, count: 267 }, { hour: 19, count: 298 }, { hour: 20, count: 345 },
            { hour: 21, count: 289 }, { hour: 22, count: 198 }, { hour: 23, count: 123 }
          ]
        },
        topBooks: [
          { id: '1', title: 'دعاء الكروان', author: 'طه حسين', downloads: 2341, views: 5678, rating: 4.9 },
          { id: '2', title: 'مدن الملح', author: 'عبد الرحمن منيف', downloads: 1987, views: 4321, rating: 4.8 },
          { id: '3', title: 'الأسود يليق بك', author: 'أحلام مستغانمي', downloads: 1654, views: 3456, rating: 4.7 },
          { id: '4', title: 'مئة عام من العزلة', author: 'غابرييل غارسيا ماركيز', downloads: 1432, views: 2987, rating: 4.6 },
          { id: '5', title: 'رجال في الشمس', author: 'غسان كنفاني', downloads: 1289, views: 2654, rating: 4.5 }
        ],
        recentActivity: [
          { id: '1', type: 'download', description: 'تم تحميل كتاب "دعاء الكروان" 23 مرة اليوم', timestamp: '2025-08-11T10:30:00Z' },
          { id: '2', type: 'registration', description: 'انضم 15 مستخدم جديد اليوم', timestamp: '2025-08-11T09:15:00Z' },
          { id: '3', type: 'review', description: 'تم نشر 8 مراجعات جديدة', timestamp: '2025-08-11T08:45:00Z' },
          { id: '4', type: 'upload', description: 'تم رفع 3 كتب جديدة', timestamp: '2025-08-11T07:20:00Z' }
        ]
      };

      setData(analyticsData);
    } catch (error) {
      setError('فشل في تحميل بيانات التحليلات');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center rtl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center rtl">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!data) return null;

  return (
    <AdminLayout>
      <div className="rtl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
              <p className="text-gray-600 mt-2">تتبع أداء المنصة والمستخدمين</p>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 3 أشهر</option>
                <option value="1y">آخر سنة</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <CalendarIcon className="w-5 h-5 ml-2" />
                تحديث
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">المستخدمين</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(data.overview.totalUsers)}</dd>
                </dl>
              </div>
              <div className="flex items-center">
                {data.trends.usersGrowth > 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 ml-1" />
                )}
                <span className={`text-sm ${data.trends.usersGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(data.trends.usersGrowth)}%
                </span>
              </div>
            </div>
          </div>

          {/* Total Books */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">الكتب</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(data.overview.totalBooks)}</dd>
                </dl>
              </div>
              <div className="flex items-center">
                {data.trends.booksGrowth > 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 ml-1" />
                )}
                <span className={`text-sm ${data.trends.booksGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(data.trends.booksGrowth)}%
                </span>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">التحميلات</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(data.overview.totalDownloads)}</dd>
                </dl>
              </div>
              <div className="flex items-center">
                {data.trends.downloadsGrowth > 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 ml-1" />
                )}
                <span className={`text-sm ${data.trends.downloadsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(data.trends.downloadsGrowth)}%
                </span>
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">المراجعات</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(data.overview.totalReviews)}</dd>
                </dl>
              </div>
              <div className="flex items-center">
                {data.trends.reviewsGrowth > 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 ml-1" />
                )}
                <span className={`text-sm ${data.trends.reviewsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(data.trends.reviewsGrowth)}%
                </span>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">متوسط التقييم</dt>
                  <dd className="text-lg font-medium text-gray-900">{(data.overview.avgRating || 0).toFixed(1)} ⭐</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Users Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">المستخدمين الجدد شهرياً</h3>
            <div className="h-64 flex items-end justify-between space-x-2 space-x-reverse">
              {data.charts.monthlyUsers.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 w-full rounded-t"
                    style={{ height: `${(item.count / Math.max(...data.charts.monthlyUsers.map(i => i.count))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2 transform rotate-45">{item.month}</span>
                  <span className="text-xs font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Downloads Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">التحميلات الشهرية</h3>
            <div className="h-64 flex items-end justify-between space-x-2 space-x-reverse">
              {data.charts.monthlyDownloads.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-purple-500 w-full rounded-t"
                    style={{ height: `${(item.count / Math.max(...data.charts.monthlyDownloads.map(i => i.count))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2 transform rotate-45">{item.month}</span>
                  <span className="text-xs font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Genres */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">الأنواع الأكثر شعبية</h3>
            <div className="space-y-4">
              {data.charts.topGenres.map((genre, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{genre.genre}</span>
                    <span className="text-sm text-gray-600">{genre.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${genre.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Books */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">الكتب الأكثر تحميلاً</h3>
            <div className="space-y-4">
              {data.topBooks.map((book, index) => (
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
                      <ArrowDownTrayIcon className="w-4 h-4 ml-1" />
                      {formatNumber(book.downloads)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <StarIcon className="w-3 h-3 text-yellow-400 ml-1" />
                      {book.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">النشاط الأخير</h3>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    {activity.type === 'download' && <ArrowDownTrayIcon className="w-5 h-5 text-purple-500" />}
                    {activity.type === 'registration' && <UsersIcon className="w-5 h-5 text-green-500" />}
                    {activity.type === 'review' && <StarIcon className="w-5 h-5 text-yellow-500" />}
                    {activity.type === 'upload' && <BookOpenIcon className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="mr-3 flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
