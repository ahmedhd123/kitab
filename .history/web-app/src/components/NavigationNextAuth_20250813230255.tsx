'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  BookOpen, 
  Search, 
  User, 
  Menu, 
  X, 
  Home,
  Compass,
  Library,
  Heart,
  Bell,
  Settings,
  LogOut,
  Mail,
  UserPlus,
  LogIn
} from 'lucide-react';

interface NavigationProps {
  currentPage?: string;
}

type MenuItem = {
  label: string;
  icon: any;
  href: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
};

export default function Navigation({ currentPage = '' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(0);
  const { data: session, status } = useSession();
  
  const isAuthenticated = !!session;
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  const menuItems: MenuItem[] = [
    { label: 'الرئيسية', icon: Home, href: '/' },
    { label: 'استكشاف', icon: Compass, href: '/explore' },
    { label: 'مكتبتي', icon: Library, href: '/library', requiresAuth: true },
    { label: 'المفضلة', icon: Heart, href: '/favorites', requiresAuth: true },
    { label: 'الإشعارات', icon: Bell, href: '/notifications', requiresAuth: true },
    { label: 'الإعدادات', icon: Settings, href: '/settings', requiresAuth: true },
    { label: 'لوحة التحكم', icon: Settings, href: '/admin', adminOnly: true },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getDisplayName = () => {
    if (!user) return '';
    return user.name || user.email?.split('@')[0] || 'مستخدم';
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                كتابي
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {menuItems.map((item) => {
              if (item.requiresAuth && !isAuthenticated) return null;
              if (item.adminOnly && !isAdmin) return null;
              
              const isActive = currentPage === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.href === '/notifications' && notifications > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ابحث عن كتاب أو مؤلف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                />
              </div>
            </form>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-2 space-x-reverse">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isAdmin ? 'مدير' : 'مستخدم'}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link
                  href="/test-simple-auth"
                  className="flex items-center space-x-1 space-x-reverse px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>جرب الآن</span>
                </Link>
                <Link
                  href="/auth/simple-login"
                  className="flex items-center space-x-1 space-x-reverse px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>دخول</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden menu-button p-2 rounded-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mobile-menu border-t border-gray-100 py-4">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ابحث عن كتاب أو مؤلف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Menu Items */}
            <div className="space-y-1 px-4">
              {menuItems.map((item) => {
                if (item.requiresAuth && !isAuthenticated) return null;
                if (item.adminOnly && !isAdmin) return null;
                
                const isActive = currentPage === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 space-x-reverse px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.href === '/notifications' && notifications > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Section */}
            {isAuthenticated && (
              <div className="px-4 pt-4 border-t border-gray-100 mt-4">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isAdmin ? 'مدير' : 'مستخدم'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
