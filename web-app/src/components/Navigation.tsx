'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Mail
} from 'lucide-react';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'الرئيسية', icon: Home, href: '/' },
    { id: 'explore', label: 'استكشاف', icon: Compass, href: '/explore' },
    { id: 'arabic', label: 'أدب عربي', icon: BookOpen, href: '/explore?category=arabic', featured: true },
    { id: 'library', label: 'مكتبتي', icon: Library, href: '/library' },
    { id: 'favorites', label: 'المفضلة', icon: Heart, href: '/favorites' },
  ];

  const userMenuItems = [
    { label: 'ملفي الشخصي', icon: User, href: '/profile/1' },
    { label: 'الإشعارات', icon: Bell, href: '/notifications' },
    { label: 'الإعدادات', icon: Settings, href: '/settings' },
    { label: 'إدارة الكتب', icon: BookOpen, href: '/admin/books', admin: true },
    { label: 'استيراد كتب', icon: BookOpen, href: '/admin/import', admin: true },
    { label: 'تواصل معنا', icon: Mail, href: '/contact' },
    { label: 'تسجيل الخروج', icon: LogOut, href: '/auth/login' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-800">كتابي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors relative ${
                    item.featured
                      ? isActive
                        ? 'bg-amber-100 text-amber-800 shadow-sm'
                        : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 shadow-sm border border-amber-200'
                      : isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.featured && !isActive && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      ⭐
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن كتاب أو مؤلف..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors text-right"
              />
            </div>
          </div>

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <span className="hidden md:block text-gray-700 font-medium">سارة</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">سارة أحمد</p>
                    <p className="text-sm text-gray-500">sara@example.com</p>
                  </div>
                  
                  {userMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    // Skip admin items for non-admin users (in real app, check user role)
                    if (item.admin && false) return null; // Replace false with actual admin check
                    
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن كتاب أو مؤلف..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                />
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors relative ${
                      item.featured
                        ? isActive
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-amber-600 hover:bg-amber-50 border-r-4 border-amber-300'
                        : isActive
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.featured && (
                      <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">جديد</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isMenuOpen || isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </nav>
  );
}
