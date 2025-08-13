'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('admin@kitabi.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('بيانات غير صحيحة');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h1>
        </div>

        {/* Demo Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center mb-2">
            🚀 نظام مبسط - بيانات جاهزة:
          </p>
          <div className="text-xs text-blue-600 space-y-1">
            <p>• admin@kitabi.com / admin123 (مدير)</p>
            <p>• user@kitabi.com / user123 (مستخدم)</p>
            <p>• أي بريد آخر ينشئ حساب جديد تلقائياً</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="البريد الإلكتروني"
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="كلمة المرور"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </form>

        {/* Quick Login Buttons */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => {
              setEmail('admin@kitabi.com');
              setPassword('admin123');
            }}
            className="w-full bg-green-100 text-green-800 py-2 rounded text-sm hover:bg-green-200 transition-colors"
          >
            دخول سريع كمدير
          </button>
          <button
            onClick={() => {
              setEmail('user@kitabi.com');
              setPassword('user123');
            }}
            className="w-full bg-gray-100 text-gray-800 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            دخول سريع كمستخدم
          </button>
        </div>
      </div>
    </div>
  );
}
