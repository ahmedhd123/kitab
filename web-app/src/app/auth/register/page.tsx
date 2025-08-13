'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      // Generate a clean username from the name
      const cleanUsername = formData.name
        .replace(/[^a-zA-Z0-9]/g, '') // Remove all non-alphanumeric characters
        .toLowerCase()
        .substring(0, 20) // Limit length
        || 'user' + Date.now().toString().slice(-6); // Fallback if name is empty or all special chars

      // Direct Railway connection for production reliability
      const RAILWAY_API = 'https://kitab-production.up.railway.app/api/auth/register';
      
      const response = await fetch(RAILWAY_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          username: cleanUsername,
          email: formData.email,
          password: formData.password,
          firstName: formData.name.split(' ')[0] || '',
          lastName: formData.name.split(' ').slice(1).join(' ') || ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard or home page
        router.push('/');
      } else {
        setError(data.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        stack: (error as any)?.stack
      });
      setError('حدث خطأ في الاتصال. تأكد من الإنترنت وحاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">انضم إلينا</h1>
          <p className="text-gray-600">أنشئ حساباً جديداً وابدأ رحلتك في القراءة</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-right">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              الاسم الكامل
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                placeholder="محمد أحمد"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-11 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-11 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
            </div>
            <div className="mr-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                أوافق على{' '}
                <Link href="/terms" className="text-emerald-600 hover:text-emerald-500">
                  شروط الاستخدام
                </Link>
                {' '}و{' '}
                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-500">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </button>
        </form>

        {/* Social Registration */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو استخدم</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-500 font-medium">
              سجل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
