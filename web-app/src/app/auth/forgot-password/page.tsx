'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend API
    console.log('إرسال رابط إعادة تعيين كلمة المرور:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">تم إرسال الرابط</h1>
          <p className="text-gray-600 mb-6">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
            <br />
            <span className="font-medium text-gray-800">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
            >
              إرسال مرة أخرى
            </button>
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-gray-600">
            لا تقلق، سنرسل لك رابطاً لإعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            <p className="mt-2 text-sm text-gray-500 text-right">
              أدخل البريد الإلكتروني المرتبط بحسابك
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
          >
            إرسال رابط إعادة التعيين
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-purple-600 hover:text-purple-500 font-medium"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            العودة لتسجيل الدخول
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2 text-right">تحتاج مساعدة؟</h3>
          <p className="text-xs text-gray-600 text-right">
            إذا كنت تواجه مشكلة في الوصول لحسابك، يمكنك{' '}
            <Link href="/contact" className="text-purple-600 hover:text-purple-500">
              التواصل معنا
            </Link>
            {' '}وسنساعدك في استعادة حسابك.
          </p>
        </div>
      </div>
    </div>
  );
}
