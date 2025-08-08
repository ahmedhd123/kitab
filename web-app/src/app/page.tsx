'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, TrendingUp, Users, Sparkles, ArrowRight, Star, Heart, MessageCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useBooks } from '../hooks/useBooks';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { books: featuredBooks, loading, error } = useBooks({ limit: 4 });

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

  const aiFeatures = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "توصيات ذكية",
      description: "اكتشف كتباً جديدة بناءً على ذوقك وتفضيلاتك"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "تحليل المزاج",
      description: "نحلل مزاج الكتب لنساعدك في اختيار ما يناسب حالتك"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "ملخصات تلقائية",
      description: "احصل على ملخصات ذكية للكتب قبل قراءتها"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation currentPage="home" />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            عالم الكتب
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              بذكاء اصطناعي
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            اكتشف كتباً جديدة، شارك مراجعاتك، وتواصل مع مجتمع القراء مع تقنيات الذكاء الاصطناعي المتقدمة
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-12 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                dir="rtl"
              />
              <button 
                onClick={handleSearch}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                بحث
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/explore?genre=أدب_عربي" className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200 transition-colors">
              #أدب_عربي
            </Link>
            <Link href="/explore?genre=خيال_علمي" className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 transition-colors">
              #خيال_علمي
            </Link>
            <Link href="/explore?genre=تطوير_ذات" className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 transition-colors">
              #تطوير_ذات
            </Link>
            <Link href="/explore?genre=تاريخ" className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm hover:bg-orange-200 transition-colors">
              #تاريخ
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              تقنيات الذكاء الاصطناعي
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              نستخدم أحدث تقنيات الذكاء الاصطناعي لتحسين تجربة القراءة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                كتب مميزة
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                اكتشف أفضل الكتب المختارة لك
              </p>
            </div>
            <Link href="/explore" className="flex items-center space-x-2 rtl:space-x-reverse text-purple-600 hover:text-purple-700 font-medium">
              <span>عرض المزيد</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-80 rounded-2xl mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-3/4"></div>
                </div>
              ))
            ) : featuredBooks.length > 0 ? (
              featuredBooks.map((book) => (
                <Link key={book.id} href={`/book/${book.id}`} className="group cursor-pointer block">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/300x450/6366f1/white?text=${encodeURIComponent(book.title)}`;
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm text-gray-700 dark:text-gray-300">
                        {book.genres[0] || 'كتاب'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                      <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                      <p className="text-gray-200 text-sm mb-2">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{book.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Handle add to favorites
                            }}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-gray-300">{book.ratingsCount} تقييم</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">لا توجد كتب متاحة حالياً</p>
                {error && (
                  <p className="text-red-500 text-sm mt-2">خطأ: {error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">انضم لمجتمع القراء</h2>
          <p className="text-xl mb-12 text-purple-100">
            آلاف القراء يشاركون تجاربهم معنا يومياً
          </p>
          
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-purple-100">قارئ نشط</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-purple-100">كتاب في المكتبة</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">250K+</div>
              <div className="text-purple-100">مراجعة وتقييم</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold">كتابي</span>
              </div>
              <p className="text-gray-400">
                منصة القراءة الذكية التي تجمع محبي الكتب من جميع أنحاء العالم
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">الاستكشاف</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/explore?filter=new" className="hover:text-white">كتب جديدة</Link></li>
                <li><Link href="/explore?sort=popular" className="hover:text-white">الأكثر شعبية</Link></li>
                <li><Link href="/explore?ai=recommendations" className="hover:text-white">توصيات ذكية</Link></li>
                <li><Link href="/authors" className="hover:text-white">المؤلفون</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">المجتمع</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/groups" className="hover:text-white">مجموعات القراءة</Link></li>
                <li><Link href="/discussions" className="hover:text-white">النقاشات</Link></li>
                <li><Link href="/events" className="hover:text-white">الفعاليات</Link></li>
                <li><Link href="/challenges" className="hover:text-white">تحدي القراءة</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">الدعم</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">مركز المساعدة</Link></li>
                <li><Link href="/contact" className="hover:text-white">تواصل معنا</Link></li>
                <li><Link href="/privacy" className="hover:text-white">الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-white">الشروط</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 كتابي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
