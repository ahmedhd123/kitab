'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, LogOut, User, Home } from 'lucide-react';

export default function SimpleNavigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">كتابي</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 space-x-reverse"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            
            <Link 
              href="/explore" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              استكشاف
            </Link>
            
            <Link 
              href="/library" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              مكتبتي
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {session ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-sm text-gray-700">
                  مرحباً، {session.user?.name}
                </span>
                
                {session.user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    إدارة
                  </Link>
                )}
                
                <button
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-red-600 p-2 rounded-md"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link 
                  href="/auth/simple-login" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  دخول
                </Link>
                <Link 
                  href="/test-simple-auth" 
                  className="text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  اختبار
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
