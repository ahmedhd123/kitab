'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  Library, 
  User,
  Menu,
  Home,
  Heart,
  Star,
  TrendingUp
} from 'lucide-react';
import BookLibrary from './BookLibrary';
import BookUpload from './BookUpload';
import { useSession } from 'next-auth/react';

type ActiveTab = 'home' | 'library' | 'upload' | 'favorites' | 'profile';

export default function KitabiMain() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const { data: session } = useSession();

  const stats = {
    totalBooks: 15420,
    totalReads: 89320,
    totalUsers: 5240,
    newBooks: 142
  };

  const featuredBooks = [
    {
      id: '1',
      title: 'مئة عام من العزلة',
      author: 'غابرييل غارسيا ماركيز',
      rating: 4.8,
      reads: 5420
    },
    {
      id: '2',
      title: 'البؤساء',
      author: 'فيكتور هوجو',
      rating: 4.7,
      reads: 3240
    },
    {
      id: '3',
      title: 'ديوان المتنبي',
      author: 'أبو الطيب المتنبي',
      rating: 4.9,
      reads: 7890
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return <BookLibrary />;
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto">
            <BookUpload onUploadComplete={() => setActiveTab('library')} />
          </div>
        );
      case 'home':
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 mb-8">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">
                  مرحباً بك في كتابي
                </h1>
                <p className="text-xl text-blue-100 mb-6">
                  منصة القراءة الذكية للكتب العربية - اقرأ، شارك، واكتشف عالماً من المعرفة
                </p>
                <div className="flex space-x-4 space-x-reverse">
                  <button 
                    onClick={() => setActiveTab('library')}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    تصفح المكتبة
                  </button>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    أضف كتاباً
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalBooks.toLocaleString()}</h3>
                <p className="text-gray-600">كتاب</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalReads.toLocaleString()}</h3>
                <p className="text-gray-600">قراءة</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-gray-600">قارئ</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.newBooks}</h3>
                <p className="text-gray-600">كتاب جديد هذا الشهر</p>
              </div>
            </div>

            {/* Featured Books */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">الكتب المميزة</h2>
                <button 
                  onClick={() => setActiveTab('library')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  عرض الكل
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {featuredBooks.map(book => (
                  <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-600">{book.rating}</span>
                      </div>
                      <span className="text-gray-500">{book.reads} قراءة</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Library className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">اكتشف المكتبة</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  تصفح مجموعة واسعة من الكتب العربية والعالمية في جميع المجالات
                </p>
                <button 
                  onClick={() => setActiveTab('library')}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  تصفح الآن
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">شارك كتاباً</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  ارفع كتبك المفضلة وشاركها مع مجتمع القراء
                </p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  رفع كتاب
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">كتابي</span>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'home' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>الرئيسية</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'library' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Library className="w-4 h-4" />
                <span>المكتبة</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'upload' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>رفع كتاب</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'favorites' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>المفضلة</span>
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {session ? (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700">{session.user?.name || session.user?.email}</span>
                </div>
              ) : (
                <button className="text-gray-600 hover:text-gray-900">
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-white">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center p-2 ${
                activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">الرئيسية</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex flex-col items-center p-2 ${
                activeTab === 'library' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Library className="w-5 h-5 mb-1" />
              <span className="text-xs">المكتبة</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex flex-col items-center p-2 ${
                activeTab === 'upload' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-xs">رفع</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex flex-col items-center p-2 ${
                activeTab === 'favorites' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Heart className="w-5 h-5 mb-1" />
              <span className="text-xs">المفضلة</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
}
