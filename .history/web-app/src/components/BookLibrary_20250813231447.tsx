'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  Eye, 
  Star, 
  Search, 
  Filter,
  Grid,
  List,
  Plus,
  Heart,
  Share2
} from 'lucide-react';
import EbookReader from './EbookReader';
import BookUpload from './BookUpload';

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  description: string;
  genre: string;
  language: string;
  publishYear: string;
  fileUrl: string;
  fileType: 'epub' | 'pdf' | 'txt';
  rating: number;
  totalRatings: number;
  downloadCount: number;
  isBookmarked: boolean;
}

export default function BookLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showReader, setShowReader] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [loading, setLoading] = useState(true);

  const genres = ['رواية', 'قصة', 'شعر', 'علمي', 'تاريخ', 'دين', 'فلسفة', 'أدب'];
  const languages = ['العربية', 'الإنجليزية', 'الفرنسية'];

  // Sample books data
  useEffect(() => {
    const sampleBooks: Book[] = [
      {
        id: '1',
        title: 'مئة عام من العزلة',
        author: 'غابرييل غارسيا ماركيز',
        description: 'رواية ملحمية تحكي قصة عائلة بوينديا عبر قرن من الزمان في قرية ماكوندو الخيالية.',
        genre: 'رواية',
        language: 'العربية',
        publishYear: '1967',
        fileUrl: '/sample-books/hundred-years.epub',
        fileType: 'epub',
        rating: 4.8,
        totalRatings: 1250,
        downloadCount: 5420,
        isBookmarked: false
      },
      {
        id: '2',
        title: 'البؤساء',
        author: 'فيكتور هوجو',
        description: 'ملحمة أدبية عن العدالة والحب والفداء في فرنسا القرن التاسع عشر.',
        genre: 'رواية',
        language: 'العربية',
        publishYear: '1862',
        fileUrl: '/sample-books/les-miserables.pdf',
        fileType: 'pdf',
        rating: 4.7,
        totalRatings: 892,
        downloadCount: 3240,
        isBookmarked: true
      },
      {
        id: '3',
        title: 'ديوان المتنبي',
        author: 'أبو الطيب المتنبي',
        description: 'ديوان شاعر العربية الأكبر، يضم أجمل القصائد في الفخر والحكمة والوصف.',
        genre: 'شعر',
        language: 'العربية',
        publishYear: '965',
        fileUrl: '/sample-books/mutanabbi.txt',
        fileType: 'txt',
        rating: 4.9,
        totalRatings: 2100,
        downloadCount: 7890,
        isBookmarked: false
      }
    ];

    setTimeout(() => {
      setBooks(sampleBooks);
      setFilteredBooks(sampleBooks);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter books based on search and filters
  useEffect(() => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    if (selectedLanguage) {
      filtered = filtered.filter(book => book.language === selectedLanguage);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedGenre, selectedLanguage]);

  const handleBookRead = (book: Book) => {
    setSelectedBook(book);
    setShowReader(true);
  };

  const handleBookmark = (bookId: string) => {
    setBooks(prev => prev.map(book =>
      book.id === bookId
        ? { ...book, isBookmarked: !book.isBookmarked }
        : book
    ));
  };

  const handleUploadComplete = (bookData: any) => {
    console.log('Book uploaded:', bookData);
    // In real implementation, refresh books list
    setShowUpload(false);
  };

  if (showReader && selectedBook) {
    return (
      <EbookReader
        bookUrl={selectedBook.fileUrl}
        bookTitle={selectedBook.title}
        bookAuthor={selectedBook.author}
        onClose={() => setShowReader(false)}
      />
    );
  }

  if (showUpload) {
    return (
      <div>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">رفع كتاب جديد</h1>
          <button
            onClick={() => setShowUpload(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            العودة للمكتبة
          </button>
        </div>
        <BookUpload onUploadComplete={handleUploadComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">مكتبة الكتب</h1>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كتاب</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن كتاب أو مؤلف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الأنواع</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع اللغات</option>
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              {filteredBooks.length} كتاب
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد كتب</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلترة</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredBooks.map(book => (
              <div
                key={book.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                }`}
              >
                {/* Book Cover */}
                <div className={`flex-shrink-0 ${viewMode === 'list' ? 'w-16 h-20 ml-4' : 'w-full h-48 mb-4'}`}>
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Book Info */}
                <div className={`flex-grow ${viewMode === 'list' ? 'min-w-0' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold text-gray-900 ${viewMode === 'list' ? 'text-base' : 'text-lg'} line-clamp-2`}>
                      {book.title}
                    </h3>
                    <button
                      onClick={() => handleBookmark(book.id)}
                      className={`p-1 rounded ${book.isBookmarked ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform`}
                    >
                      <Heart className={`w-4 h-4 ${book.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  
                  {viewMode === 'grid' && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description}</p>
                  )}

                  {/* Rating and Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{book.rating}</span>
                      <span>({book.totalRatings})</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Download className="w-3 h-3" />
                      <span>{book.downloadCount}</span>
                    </div>
                  </div>

                  {/* Genre and Language Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {book.genre}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {book.language}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col sm:flex-row' : ''}`}>
                    <button
                      onClick={() => handleBookRead(book)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 space-x-reverse"
                    >
                      <Eye className="w-4 h-4" />
                      <span>قراءة</span>
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1 space-x-reverse">
                      <Download className="w-4 h-4" />
                      <span>تحميل</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
