'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, BookOpen, Star, Filter } from 'lucide-react';
import Navigation from '../../components/Navigation';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  // Mock search results
  const mockResults = [
    {
      id: 1,
      title: "مئة عام من العزلة",
      author: "غابرييل غارثيا ماركيث",
      rating: 4.8,
      reviews: 1250,
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
      genre: "أدب لاتيني",
      description: "رواية من الأدب اللاتيني تحكي قصة عائلة بوينديا عبر مئة عام"
    },
    {
      id: 2,
      title: "الأسود يليق بك",
      author: "أحلام مستغانمي",
      rating: 4.3,
      reviews: 2100,
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&crop=center",
      genre: "رومانسية",
      description: "رواية رومانسية تتناول قصة حب معقدة في الجزائر"
    }
  ];

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockResults.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setIsLoading(false);
      }, 1000);
    }
  }, [query]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">نتائج البحث</h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-12 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

          {query && (
            <p className="mt-4 text-gray-600">
              البحث عن: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري البحث...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <p className="mb-6 text-gray-600">
              تم العثور على {searchResults.length} نتيجة
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(book => (
                <Link key={book.id} href={`/book/${book.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm text-gray-700">
                        {book.genre}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center ml-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{book.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({book.reviews} مراجعة)</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تحقق من الإملاء</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ابحث عن كتابك المفضل</h3>
            <p className="text-gray-500">استخدم شريط البحث أعلاه للعثور على الكتب والمؤلفين</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل صفحة البحث...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
