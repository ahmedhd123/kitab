'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BookOpen, Search, TrendingUp, Users, Sparkles, ArrowRight, Star, Heart, MessageCircle, BookMarked, Users2, Award, Globe, UserPlus, LogIn } from 'lucide-react';
import NavigationNextAuth from '@/components/NavigationNextAuth';
import { useBooks } from '@/hooks/useBooks';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const router = useRouter();
  
  // Ensure client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get non-Arabic books for featured section - only on client
  const { books: featuredBooks, loading, error } = isClient ? useBooks({ limit: 6 }) : { books: [], loading: true, error: null };
  const nonArabicBooks = featuredBooks.filter(book => !book.genres.includes('أدب عربي'));

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Floating animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll('.floating-element');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        element.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 10}px)`;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const aiFeatures = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "توصيات ذكية",
      description: "اكتشف كتباً جديدة بناءً على ذوقك وتفضيلاتك",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "تحليل المزاج",
      description: "نحلل مزاج الكتب لنساعدك في اختيار ما يناسب حالتك",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "ملخصات تلقائية",
      description: "احصل على ملخصات ذكية للكتب قبل قراءتها",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const genres = [
    { name: "أدب عربي", count: "2,547", color: "amber", featured: true },
    { name: "خيال علمي", count: "856", color: "blue" },
    { name: "تطوير ذات", count: "2,103", color: "green" },
    { name: "تاريخ", count: "945", color: "orange" },
    { name: "روايات", count: "3,421", color: "pink" },
    { name: "فلسفة", count: "567", color: "indigo" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <NavigationNextAuth currentPage="/" />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Hero Content */}
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-purple-200/50">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">مدعوم بالذكاء الاصطناعي</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              <span className="block mb-4">عالم الكتب</span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                بذكاء اصطناعي
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              اكتشف كتباً جديدة، شارك مراجعاتك، وتواصل مع مجتمع القراء مع تقنيات الذكاء الاصطناعي المتقدمة
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                <div className="flex items-center">
                  <Search className="absolute right-6 text-gray-400 w-6 h-6 z-10" />
                  <input
                    type="text"
                    placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="w-full pl-4 pr-16 py-6 text-lg bg-transparent border-none focus:ring-0 focus:outline-none dark:text-white placeholder-gray-500"
                    dir="rtl"
                  />
                  <button 
                    onClick={handleSearch}
                    className="m-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    بحث
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Genre Tags */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {genres.map((genre, index) => (
                <Link 
                  key={index}
                  href={`/explore?genre=${encodeURIComponent(genre.name)}`} 
                  className={`group relative p-4 ${genre.featured 
                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 border-2 border-amber-300 dark:border-amber-600' 
                    : 'bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50'
                  } backdrop-blur-sm rounded-2xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-${genre.color}-500 to-${genre.color}-600 flex items-center justify-center ${genre.featured ? 'ring-2 ring-amber-400' : ''}`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`font-semibold text-sm mb-1 ${genre.featured ? 'text-amber-800 dark:text-amber-200' : 'text-gray-900 dark:text-white'}`}>
                      {genre.name}
                      {genre.featured && <span className="text-xs text-amber-600 dark:text-amber-400 block">⭐ مميز</span>}
                    </h3>
                    <p className={`text-xs ${genre.featured ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {genre.count} كتاب
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section for Non-Authenticated Users */}
      {!isAuthenticated && (
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                انضم إلى مجتمع القراء
              </h2>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                ابدأ رحلتك في عالم الكتب مع توصيات ذكية مخصصة لك وتواصل مع قراء آخرين يشاركونك نفس الاهتمامات
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/test-simple-auth"
                className="group relative px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 min-w-[200px]"
              >
                <span className="flex items-center justify-center gap-3">
                  <UserPlus className="w-6 h-6" />
                  جرب النظام الآن
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <Link 
                href="/auth/simple-login"
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 min-w-[200px]"
              >
                <span className="flex items-center justify-center gap-3">
                  <LogIn className="w-6 h-6" />
                  تسجيل دخول سريع
                </span>
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>مجاني تماماً</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>توصيات ذكية</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>مجتمع نشط</span>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </section>
      )}

      {/* AI Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">تقنيات متقدمة</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              تقنيات الذكاء الاصطناعي
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              نستخدم أحدث تقنيات الذكاء الاصطناعي لتحسين تجربة القراءة وتقديم توصيات مخصصة
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6">
                    <button className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group">
                      اعرف المزيد
                      <ArrowRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arabic Books Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-full px-6 py-3 mb-6">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">تراثنا الأدبي</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              الكتب العربية المميزة
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              اكتشف روائع الأدب العربي والكتاب المعاصرين الذين أثروا الثقافة العربية
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* دعاء الكروان - طه حسين */}
            <Link href="/book/7" className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"
                  alt="دعاء الكروان"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2 py-1 bg-amber-100/95 dark:bg-amber-800/95 backdrop-blur-sm rounded-full text-xs font-medium text-amber-800 dark:text-amber-200 shadow-lg">
                    أدب عربي كلاسيكي
                  </span>
                </div>
                
                <div className="absolute top-3 left-3 z-20">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle add to favorites
                    }}
                    className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white z-20">
                  <h3 className="font-bold text-sm mb-1">دعاء الكروان</h3>
                  <p className="text-gray-200 text-xs mb-2">طه حسين</p>
                  <p className="text-gray-300 text-xs mb-2 line-clamp-2">رواية مؤثرة تحكي قصة حب وألم في الريف المصري</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">4.9</span>
                    </div>
                    <span className="text-xs text-gray-300">1,563</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* مدن الملح - عبد الرحمن منيف */}
            <Link href="/book/8" className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
                  alt="مدن الملح"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2 py-1 bg-amber-100/95 dark:bg-amber-800/95 backdrop-blur-sm rounded-full text-xs font-medium text-amber-800 dark:text-amber-200 shadow-lg">
                    أدب عربي معاصر
                  </span>
                </div>
                
                <div className="absolute top-3 left-3 z-20">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle add to favorites
                    }}
                    className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white z-20">
                  <h3 className="font-bold text-sm mb-1">مدن الملح</h3>
                  <p className="text-gray-200 text-xs mb-2">عبد الرحمن منيف</p>
                  <p className="text-gray-300 text-xs mb-2 line-clamp-2">ملحمة روائية خماسية تصور التحولات الاجتماعية</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">4.8</span>
                    </div>
                    <span className="text-xs text-gray-300">987</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* CTA for Arabic Books */}
          <div className="text-center mt-16">
            <Link href="/explore?category=arabic" className="group inline-flex items-center space-x-3 rtl:space-x-reverse bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <span className="font-medium">استكشف المزيد من الكتب العربية</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24 px-4 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                كتب مميزة أخرى
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                اكتشف أفضل الكتب العالمية المختارة لك بعناية
              </p>
            </div>
            <Link href="/explore" className="group flex items-center space-x-3 rtl:space-x-reverse bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <span className="font-medium">عرض المزيد</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {loading ? (
              // Enhanced loading skeleton
              [...Array(6)].map((_, index) => (
                <div key={index} className="group animate-pulse">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="bg-gradient-to-br from-gray-300 to-gray-400 h-48 w-full"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="bg-gray-300 h-4 rounded mb-2"></div>
                      <div className="bg-gray-300 h-3 rounded w-3/4 mb-3"></div>
                      <div className="flex justify-between">
                        <div className="bg-gray-300 h-3 rounded w-12"></div>
                        <div className="bg-gray-300 h-3 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : nonArabicBooks.length > 0 ? (
              nonArabicBooks.slice(0, 6).map((book) => (
                <Link key={book.id} href={`/book/${book.id}`} className="group cursor-pointer block">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/200x300/6366f1/white?text=${encodeURIComponent(book.title)}`;
                      }}
                    />
                    
                    <div className="absolute top-3 right-3 z-20">
                      <span className="px-2 py-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-lg">
                        {book.genres[0] || 'كتاب'}
                      </span>
                    </div>
                    
                    <div className="absolute top-3 left-3 z-20">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle add to favorites
                        }}
                        className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                      >
                        <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white z-20">
                      <h3 className="font-bold text-sm mb-1 line-clamp-2">{book.titleArabic || book.title}</h3>
                      <p className="text-gray-200 text-xs mb-2">{book.authorArabic || book.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium">{(book.rating || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-gray-300">{book.ratingsCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">لا توجد كتب متاحة حالياً</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">سنضيف المزيد من الكتب قريباً</p>
                {error && (
                  <p className="text-red-500 text-sm mt-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg inline-block">
                    خطأ: {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">انضم لمجتمع القراء</h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              آلاف القراء يشاركون تجاربهم معنا يومياً في رحلة اكتشاف عوالم جديدة
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/80 text-lg">قارئ نشط</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookMarked className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100K+</div>
              <div className="text-white/80 text-lg">كتاب في المكتبة</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">250K+</div>
              <div className="text-white/80 text-lg">مراجعة وتقييم</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-lg">دولة حول العالم</div>
            </div>
          </div>

          <div className="mt-16">
            <Link href="/auth/register" className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-white text-purple-600 px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
              <span>ابدأ رحلتك الآن</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold">كتابي</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                منصة القراءة الذكية التي تجمع محبي الكتب من جميع أنحاء العالم. اكتشف، اقرأ، وشارك في رحلة لا تنتهي من المعرفة والإلهام.
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <button className="w-12 h-12 bg-gray-800 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-colors">
                  <span className="sr-only">تويتر</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </button>
                <button className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors">
                  <span className="sr-only">فيسبوك</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button className="w-12 h-12 bg-gray-800 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-colors">
                  <span className="sr-only">إنستجرام</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.901 8.248 7.052 7.758 8.349 7.758s2.448.49 3.323 1.297c.896.896 1.386 2.047 1.386 3.344s-.49 2.448-1.386 3.344c-.875.807-2.026 1.297-3.323 1.297z"/></svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">الاستكشاف</h3>
              <ul className="space-y-3">
                <li><Link href="/explore?filter=new" className="text-gray-400 hover:text-white transition-colors flex items-center">كتب جديدة</Link></li>
                <li><Link href="/explore?sort=popular" className="text-gray-400 hover:text-white transition-colors">الأكثر شعبية</Link></li>
                <li><Link href="/explore?ai=recommendations" className="text-gray-400 hover:text-white transition-colors">توصيات ذكية</Link></li>
                <li><Link href="/authors" className="text-gray-400 hover:text-white transition-colors">المؤلفون</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">المجتمع</h3>
              <ul className="space-y-3">
                <li><Link href="/groups" className="text-gray-400 hover:text-white transition-colors">مجموعات القراءة</Link></li>
                <li><Link href="/discussions" className="text-gray-400 hover:text-white transition-colors">النقاشات</Link></li>
                <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors">الفعاليات</Link></li>
                <li><Link href="/challenges" className="text-gray-400 hover:text-white transition-colors">تحدي القراءة</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">الدعم</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">مركز المساعدة</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">تواصل معنا</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">الخصوصية</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">الشروط</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 كتابي. جميع الحقوق محفوظة.</p>
              <div className="flex items-center space-x-6 rtl:space-x-reverse text-gray-400">
                <span>صنع بـ ❤️ للقراء العرب</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
