'use client';

import Link from 'next/link';
import { BookOpen, ArrowLeft, Users, BookmarkCheck, Zap } from 'lucide-react';

export default function AuthLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-8">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            مرحباً بك في <span className="text-purple-600">كتابي</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            منصة القراءة الذكية التي تجمع محبي الكتب في مجتمع واحد. 
            اكتشف كتباً جديدة، شارك آراءك، واحصل على توصيات مخصصة لك
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/auth/register"
              className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2 min-w-[200px] justify-center"
            >
              ابدأ رحلتك الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-600 hover:text-white transition-colors duration-300 min-w-[200px] text-center"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <BookmarkCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-right">تتبع قراءاتك</h3>
            <p className="text-gray-600 text-right">
              سجل الكتب التي قرأتها وتلك التي تريد قراءتها، وتابع تقدمك في القراءة
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-right">مجتمع القراء</h3>
            <p className="text-gray-600 text-right">
              انضم لمجتمع محبي القراءة، شارك مراجعاتك وتفاعل مع القراء الآخرين
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-right">توصيات ذكية</h3>
            <p className="text-gray-600 text-right">
              احصل على توصيات مخصصة باستخدام الذكاء الاصطناعي حسب اهتماماتك
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">انضم لآلاف القراء</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">قارئ نشط</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">كتاب مسجل</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25K+</div>
              <div className="text-gray-600">مراجعة</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100K+</div>
              <div className="text-gray-600">توصية ذكية</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">جاهز لبدء رحلتك؟</h2>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            إنشاء حساب مجاني
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
