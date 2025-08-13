'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, Search, TrendingUp, Users, Sparkles } from 'lucide-react';
import SimpleNavigation from '@/components/SimpleNavigation';

export default function SimpleHome() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {session ? `مرحباً ${session.user?.name}!` : 'مرحباً بك في كتابي'}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            منصتك المفضلة لاستكشاف عالم الكتب والقراءة
          </p>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-md mx-auto">
            {session ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  نظام المصادقة يعمل!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  تم تسجيل الدخول باستخدام NextAuth.js
                </p>
                <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                  <p><strong>البريد:</strong> {session.user?.email}</p>
                  <p><strong>النوع:</strong> {session.user?.role}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">🔐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  نظام مبسط وسريع
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  تسجيل دخول فوري بنقرة واحدة
                </p>
                <Link 
                  href="/test-simple-auth"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  جرب الآن
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">استكشف</h3>
            <p className="text-gray-600">ابحث واستكشف آلاف الكتب</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">اقرأ</h3>
            <p className="text-gray-600">اقرأ كتبك المفضلة أونلاين</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">شارك</h3>
            <p className="text-gray-600">شارك آرائك مع مجتمع القراءة</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ابدأ رحلتك
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/explore"
              className="block p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">استكشف الكتب</h3>
                  <p className="text-gray-600">اكتشف كتب جديدة ومثيرة</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/library"
              className="block p-6 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <Sparkles className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">مكتبتي</h3>
                  <p className="text-gray-600">أدر مجموعة كتبك الشخصية</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
