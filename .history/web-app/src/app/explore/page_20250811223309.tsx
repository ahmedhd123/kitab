'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  BookOpen, Search, Filter, Star, Heart, TrendingUp, Clock, Users, 
  Grid, List, SlidersHorizontal, ChevronDown, X, BookMarked, 
  Award, Globe, Sparkles, ArrowRight, Eye, Calendar
} from 'lucide-react';
import Navigation from '../../components/Navigation';
import { useBooks } from '../../hooks/useBooks';

interface FilterState {
  genres: string[];
  languages: string[];
  ratings: number[];
  publishYear: [number, number];
  sortBy: string;
  viewMode: 'grid' | 'list';
}

function ExplorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    genres: searchParams?.get('genre') ? [searchParams.get('genre')!] : 
           searchParams?.get('category') === 'arabic' ? ['أدب عربي'] : [],
    languages: [],
    ratings: [],
    publishYear: [1900, 2025],
    sortBy: searchParams?.get('sort') || 'popular',
    viewMode: 'grid'
  });

  // Check if this is Arabic books category
  const isArabicCategory = searchParams?.get('category') === 'arabic';

  // Update filters when URL parameters change
  useEffect(() => {
    if (isArabicCategory) {
      setFilters(prev => ({
        ...prev,
        genres: ['أدب عربي']
      }));
    }
  }, [isArabicCategory]);

  const { books, loading, error } = useBooks({ 
    search: searchQuery,
    genre: filters.genres[0] || undefined,
    limit: 24 
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (filters.genres.length > 0) params.set('genre', filters.genres[0]);
    if (filters.sortBy !== 'popular') params.set('sort', filters.sortBy);
    
    router.push(`/explore?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const genres = [
    { name: "أدب عربي", count: 1234, color: "purple" },
    { name: "خيال علمي", count: 856, color: "blue" },
    { name: "تطوير ذات", count: 2103, color: "green" },
    { name: "تاريخ", count: 945, color: "orange" },
    { name: "روايات", count: 3421, color: "pink" },
    { name: "فلسفة", count: 567, color: "indigo" },
    { name: "شعر", count: 789, color: "red" },
    { name: "علوم", count: 1456, color: "cyan" },
    { name: "اقتصاد", count: 623, color: "yellow" },
    { name: "سيرة ذاتية", count: 445, color: "emerald" },
    { name: "دين", count: 2341, color: "violet" },
    { name: "طبخ", count: 234, color: "rose" }
  ];

  const languages = ["العربية", "الإنجليزية", "الفرنسية", "الألمانية", "الإسبانية"];
  const sortOptions = [
    { value: "popular", label: "الأكثر شعبية", icon: <TrendingUp className="w-4 h-4" /> },
    { value: "newest", label: "الأحدث", icon: <Clock className="w-4 h-4" /> },
    { value: "rating", label: "الأعلى تقييماً", icon: <Star className="w-4 h-4" /> },
    { value: "title", label: "الترتيب الأبجدي", icon: <BookOpen className="w-4 h-4" /> },
    { value: "author", label: "حسب المؤلف", icon: <Users className="w-4 h-4" /> }
  ];

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre) 
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const clearFilters = () => {
    setFilters({
      genres: [],
      languages: [],
      ratings: [],
      publishYear: [1900, 2025],
      sortBy: 'popular',
      viewMode: 'grid'
    });
    setSearchQuery('');
    router.push('/explore');
  };

  const activeFiltersCount = filters.genres.length + filters.languages.length + filters.ratings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <Navigation currentPage="explore" />
      
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center space-x-2 rtl:space-x-reverse backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border ${
              isArabicCategory 
                ? 'bg-amber-100/80 dark:bg-amber-800/80 border-amber-200/50' 
                : 'bg-white/80 dark:bg-gray-800/80 border-purple-200/50'
            }`}>
              <BookOpen className={`w-5 h-5 ${isArabicCategory ? 'text-amber-600' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${
                isArabicCategory 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-purple-600 dark:text-purple-400'
              }`}>
                {isArabicCategory ? 'الأدب العربي' : 'استكشف المكتبة'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {isArabicCategory ? 'كنوز الأدب العربي' : 'اكتشف كتابك التالي'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isArabicCategory 
                ? 'استكشف روائع الأدب العربي من الكلاسيكيات إلى الأعمال المعاصرة'
                : 'تصفح مكتبتنا الواسعة واعثر على الكتب التي تناسب اهتماماتك ومزاجك'
              }
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <Search className="absolute right-4 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="text"
                      placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full pl-4 pr-12 py-4 bg-transparent border-none focus:ring-0 focus:outline-none dark:text-white placeholder-gray-500"
                      dir="rtl"
                    />
                    <button 
                      onClick={handleSearch}
                      className="m-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium"
                    >
                      بحث
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span>فلترة</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="flex bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'grid'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Genres Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      الأنواع الأدبية
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {genres.map((genre) => (
                        <label key={genre.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.genres.includes(genre.name)}
                              onChange={() => toggleGenre(genre.name)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="mr-3 text-gray-700 dark:text-gray-300">{genre.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {genre.count.toLocaleString()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Languages Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      اللغة
                    </h3>
                    <div className="space-y-2">
                      {languages.map((language) => (
                        <label key={language} className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.languages.includes(language)}
                            onChange={() => {
                              setFilters(prev => ({
                                ...prev,
                                languages: prev.languages.includes(language)
                                  ? prev.languages.filter(l => l !== language)
                                  : [...prev.languages, language]
                              }));
                            }}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="mr-3 text-gray-700 dark:text-gray-300">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      ترتيب حسب
                    </h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <label key={option.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={filters.sortBy === option.value}
                            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <div className="flex items-center mr-3 text-gray-700 dark:text-gray-300">
                            {option.icon}
                            <span className="mr-2">{option.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                    <span>مسح جميع الفلاتر</span>
                  </button>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  >
                    تطبيق الفلاتر
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchQuery ? `نتائج البحث عن "${searchQuery}"` : 'جميع الكتب'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {loading ? 'جارٍ التحميل...' : `${books.length} كتاب متاح`}
              </p>
            </div>
            
            {(searchQuery || activeFiltersCount > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 rtl:space-x-reverse text-purple-600 hover:text-purple-700 font-medium"
              >
                <X className="w-4 h-4" />
                <span>مسح البحث</span>
              </button>
            )}
          </div>

          {/* Books Grid/List */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
              : 'space-y-6'
          }`}>
            {loading ? (
              // Loading skeleton
              [...Array(12)].map((_, index) => (
                <div key={index} className={`animate-pulse ${
                  viewMode === 'grid' 
                    ? 'space-y-4' 
                    : 'flex space-x-4 rtl:space-x-reverse bg-white dark:bg-gray-800 rounded-2xl p-6'
                }`}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="bg-gray-300 dark:bg-gray-600 h-80 rounded-2xl"></div>
                      <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded"></div>
                      <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-3/4"></div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-300 dark:bg-gray-600 w-24 h-32 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded w-3/4"></div>
                        <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-1/2"></div>
                        <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded"></div>
                        <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-2/3"></div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : books.length > 0 ? (
              books.map((book) => (
                <div key={book.id}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <Link href={`/book/${book.id}`} className="group cursor-pointer block">
                      <div className="relative overflow-hidden rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/400x600/6366f1/white?text=${encodeURIComponent(book.title)}`;
                          }}
                        />
                        
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg">
                            {book.genres[0] || 'كتاب'}
                          </span>
                        </div>
                        
                        <div className="absolute top-4 left-4 z-20">
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
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white z-20">
                          <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
                          <p className="text-gray-200 text-sm mb-3">{book.author}</p>
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
                              <span className="text-sm">{(book.rating || 0).toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-gray-300">{book.ratingsCount} تقييم</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // List View
                    <Link href={`/book/${book.id}`} className="group cursor-pointer block">
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 p-6">
                        <div className="flex space-x-6 rtl:space-x-reverse">
                          <div className="relative flex-shrink-0">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-24 h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/200x300/6366f1/white?text=${encodeURIComponent(book.title)}`;
                              }}
                            />
                            <div className="absolute top-2 right-2">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Handle add to favorites
                                }}
                                className="p-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                              >
                                <Heart className="w-3 h-3 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                  {book.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">{book.author}</p>
                              </div>
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                {book.genres[0] || 'كتاب'}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                              {book.description || 'لا يوجد وصف متاح لهذا الكتاب في الوقت الحالي.'}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{(book.rating || 0).toFixed(1)}</span>
                                  <span className="text-xs text-gray-500">({book.ratingsCount} تقييم)</span>
                                </div>
                                
                                <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500 text-xs">
                                  <Eye className="w-4 h-4" />
                                  <span>{book.ratingsCount || 0} مشاهدة</span>
                                </div>
                                
                                <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500 text-xs">
                                  <Calendar className="w-4 h-4" />
                                  <span>{book.year || 'غير محدد'}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
                                  اقرأ الآن
                                  <ArrowRight className="w-4 h-4 mr-1 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  لم نجد أي كتب
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? `لم نعثر على كتب تطابق "${searchQuery}". جرب مصطلحات بحث مختلفة.`
                    : 'لا توجد كتب متاحة بهذه المعايير. جرب تغيير الفلاتر.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearFilters}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    مسح الفلاتر
                  </button>
                  <Link 
                    href="/explore"
                    className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
                  >
                    تصفح جميع الكتب
                  </Link>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-4 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg inline-block">
                    خطأ: {error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Load More Button */}
          {books.length > 0 && books.length >= 24 && (
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                تحميل المزيد من الكتب
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">جاري تحميل الصفحة...</p>
          </div>
        </div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
