'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { BookOpen } from 'lucide-react';

export default function SimpleAuthTest() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">اختبار النظام المبسط</h1>
          <p className="text-gray-600 mb-6">تحتاج لتسجيل الدخول أولاً</p>
          
          <div className="space-y-3">
            <button
              onClick={() => signIn('credentials', { email: 'admin@kitabi.com', password: 'admin123' })}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              دخول سريع كمدير
            </button>
            
            <button
              onClick={() => signIn('credentials', { email: 'user@kitabi.com', password: 'user123' })}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              دخول سريع كمستخدم
            </button>

            <button
              onClick={() => signIn()}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              صفحة تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً!</h1>
        <p className="text-green-600 font-medium mb-4">✅ تم تسجيل الدخول بنجاح</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
          <h3 className="font-medium text-gray-900 mb-2">معلومات المستخدم:</h3>
          <p><strong>الاسم:</strong> {session.user?.name}</p>
          <p><strong>البريد:</strong> {session.user?.email}</p>
          <p><strong>النوع:</strong> {session.user?.role}</p>
          <p><strong>المعرف:</strong> {session.user?.id}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            الذهاب للصفحة الرئيسية
          </button>
          
          {session.user?.role === 'admin' && (
            <button
              onClick={() => window.location.href = '/admin'}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              لوحة التحكم
            </button>
          )}
          
          <button
            onClick={() => signOut()}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
