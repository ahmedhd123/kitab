'use client';

import { useState } from 'react';
import { 
  Heart, 
  Star, 
  BookOpen,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  MoreVertical,
  X,
  Share2,
  Eye
} from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('date_added');

  const favoriteBooks = [
    {
      id: 1,
      title: "الأسود يليق بك",
      author: "أحلام مستغانمي",
      cover: "/book1.jpg",
      rating: 4.5,
      ratingsCount: 1247,
      genre: "رومانسي",
      addedDate: "2024-01-15",
      price: 45,
      description: "رواية عاطفية تحكي قصة امرأة تواجه تحديات الحياة والحب"
    },
    {
      id: 2,
      title: "مئة عام من العزلة",
      author: "غابرييل غارسيا ماركيز",
      cover: "/book2.jpg",
      rating: 4.8,
      ratingsCount: 2156,
      genre: "أدب كلاسيكي",
      addedDate: "2024-01-12",
      price: 52,
      description: "ملحمة أدبية تحكي قصة عائلة بوينديا عبر أجيال متعددة"
    },
    {
      id: 3,
      title: "كافكا على الشاطئ",
      author: "هاروكي موراكامي",
      cover: "/book3.jpg",
      rating: 4.3,
      ratingsCount: 987,
      genre: "خيال",
      addedDate: "2024-01-10",
      price: 48,
      description: "رواية سحرية واقعية تجمع بين الخيال والواقع بطريقة مذهلة"
    },
    {
      id: 4,
      title: "ذاكرة الجسد",
      author: "أحلام مستغانمي",
      cover: "/book4.jpg",
      rating: 4.6,
      ratingsCount: 1893,
      genre: "رومانسي",
      addedDate: "2024-01-08",
      price: 42,
      description: "رواية تتناول ذكريات الحب والوطن والفقدان"
    },
    {
      id: 5,
      title: "الخيميائي",
      author: "باولو كويلو",
      cover: "/book5.jpg",
      rating: 4.2,
      ratingsCount: 3421,
      genre: "إلهام",
      addedDate: "2024-01-05",
      price: 35,
      description: "قصة ملهمة عن شاب يسعى لتحقيق حلمه والعثور على كنزه"
    },
    {
      id: 6,
      title: "قواعد العشق الأربعون",
      author: "إليف شافاق",
      cover: "/book6.jpg",
      rating: 4.5,
      ratingsCount: 2847,
      genre: "تاريخي",
      addedDate: "2024-01-03",
      price: 50,
      description: "رواية تجمع بين قصة حب حديثة والتصوف في القرن الثالث عشر"
    }
  ];

  const genres = ["جميع التصنيفات", "رومانسي", "أدب كلاسيكي", "خيال", "إلهام", "تاريخي"];
  const sortOptions = [
    { value: 'date_added', label: 'تاريخ الإضافة' },
    { value: 'title', label: 'العنوان' },
    { value: 'author', label: 'المؤلف' },
    { value: 'rating', label: 'التقييم' },
    { value: 'price', label: 'السعر' }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const filteredBooks = favoriteBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || selectedGenre === 'جميع التصنيفات' || book.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title, 'ar');
      case 'author':
        return a.author.localeCompare(b.author, 'ar');
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.price - b.price;
      case 'date_added':
      default:
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    }
  });

  const removeFavorite = (bookId: number) => {
    // في التطبيق الحقيقي، سيتم إزالة الكتاب من المفضلة
    console.log('Remove from favorites:', bookId);
  };

  const BookCard = ({ book }: { book: any }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/200x320/6366f1/white?text=${encodeURIComponent(book.title)}`;
          }}
        />
        
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => removeFavorite(book.id)}
            className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
            title="إزالة من المفضلة"
          >
            <X className="w-4 h-4" />
          </button>
          <button className="bg-white text-gray-600 p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute top-2 left-2">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
        </div>

        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {new Date(book.addedDate).toLocaleDateString('ar-SA')}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center ml-2">
            {renderStars(book.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {book.rating} ({book.ratingsCount})
          </span>
        </div>
        
        <div className="mb-3">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
            {book.genre}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{book.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">{book.price} ر.س</span>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm">
            عرض التفاصيل
          </button>
        </div>
      </div>
    </div>
  );

  const BookListItem = ({ book }: { book: any }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex space-x-6 group">
      <div className="relative">
        <img
          src={book.cover}
          alt={book.title}
          className="w-24 h-36 object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/96x144/6366f1/white?text=${encodeURIComponent(book.title.charAt(0))}`;
          }}
        />
        <div className="absolute -top-1 -right-1">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => removeFavorite(book.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              title="إزالة من المفضلة"
            >
              <X className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center ml-3">
            {renderStars(book.rating)}
          </div>
          <span className="text-gray-600">
            {book.rating} ({book.ratingsCount} تقييم)
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm ml-3">
            {book.genre}
          </span>
          <span className="text-sm text-gray-500">
            <Calendar className="w-4 h-4 ml-1 inline" />
            أُضيف في {new Date(book.addedDate).toLocaleDateString('ar-SA')}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{book.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-purple-600">{book.price} ر.س</span>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4" />
              <span>عرض</span>
            </button>
            <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors">
              إضافة إلى السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation currentPage="favorites" />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Heart className="w-8 h-8 text-red-500 fill-current ml-3" />
            كتبي المفضلة
          </h1>
          <p className="text-gray-600">الكتب التي أضفتها إلى قائمة المفضلة</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-1">{favoriteBooks.length}</div>
              <div className="text-gray-600">كتاب مفضل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {(favoriteBooks.reduce((sum, book) => sum + book.rating, 0) / favoriteBooks.length).toFixed(1)}
              </div>
              <div className="text-gray-600">متوسط التقييم</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {new Set(favoriteBooks.map(book => book.genre)).size}
              </div>
              <div className="text-gray-600">تصنيف</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {favoriteBooks.reduce((sum, book) => sum + book.price, 0)} ر.س
              </div>
              <div className="text-gray-600">القيمة الإجمالية</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في مفضلتك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  ترتيب حسب {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            عرض {sortedBooks.length} من {favoriteBooks.length} كتاب مفضل
          </p>
        </div>

        {/* Books Display */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedBooks.map(book => (
              <BookListItem key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedBooks.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery || selectedGenre !== 'جميع التصنيفات' ? 'لم يتم العثور على كتب' : 'لا توجد كتب مفضلة'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedGenre !== 'جميع التصنيفات' 
                ? 'جرب تغيير معايير البحث أو الفلتر' 
                : 'ابدأ بإضافة كتب إلى قائمة المفضلة'}
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              استكشاف الكتب
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
