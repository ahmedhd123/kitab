'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  Heart, 
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function Library() {
  const [activeTab, setActiveTab] = useState('reading');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const books = {
    reading: [
      {
        id: 1,
        title: "مئة عام من العزلة",
        author: "غابرييل غارسيا ماركيز",
        cover: "/book1.jpg",
        progress: 65,
        totalPages: 448,
        currentPage: 291,
        lastRead: "أمس",
        genre: "أدب كلاسيكي"
      },
      {
        id: 2,
        title: "البحث عن الوقت المفقود",
        author: "مارسيل بروست",
        cover: "/book2.jpg",
        progress: 23,
        totalPages: 3200,
        currentPage: 736,
        lastRead: "منذ 3 أيام",
        genre: "أدب كلاسيكي"
      }
    ],
    wantToRead: [
      {
        id: 3,
        title: "كافكا على الشاطئ",
        author: "هاروكي موراكامي",
        cover: "/book3.jpg",
        pages: 505,
        genre: "خيال",
        addedDate: "2024-01-15"
      },
      {
        id: 4,
        title: "الأسود يليق بك",
        author: "أحلام مستغانمي",
        cover: "/book4.jpg",
        pages: 320,
        genre: "رومانسي",
        addedDate: "2024-01-12"
      }
    ],
    read: [
      {
        id: 5,
        title: "ذاكرة الجسد",
        author: "أحلام مستغانمي",
        cover: "/book5.jpg",
        rating: 5,
        finishedDate: "2024-01-10",
        genre: "رومانسي",
        review: "رواية رائعة تحكي قصة حب مؤثرة"
      },
      {
        id: 6,
        title: "الخيميائي",
        author: "باولو كويلو",
        cover: "/book6.jpg",
        rating: 4,
        finishedDate: "2024-01-05",
        genre: "إلهام",
        review: "كتاب ملهم عن تحقيق الأحلام"
      }
    ]
  };

  const stats = {
    totalBooks: books.read.length + books.reading.length + books.wantToRead.length,
    booksRead: books.read.length,
    currentlyReading: books.reading.length,
    wantToRead: books.wantToRead.length,
    pagesRead: 2847,
    averageRating: 4.5
  };

  const tabs = [
    { id: 'reading', label: 'أقرأ حالياً', count: books.reading.length },
    { id: 'wantToRead', label: 'أريد قراءته', count: books.wantToRead.length },
    { id: 'read', label: 'قرأته', count: books.read.length }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const getCurrentBooks = () => {
    const currentBooks = books[activeTab as keyof typeof books] || [];
    return currentBooks.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const BookCard = ({ book }: { book: any }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/200x320/6366f1/white?text=${encodeURIComponent(book.title)}`;
          }}
        />
        
        {/* Progress Bar for Currently Reading */}
        {activeTab === 'reading' && book.progress && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="flex justify-between text-white text-xs mb-1">
              <span>{book.progress}%</span>
              <span>{book.currentPage}/{book.totalPages}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Rating for Read Books */}
        {activeTab === 'read' && book.rating && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
            <div className="flex items-center">
              {renderStars(book.rating)}
            </div>
          </div>
        )}

        {/* Action Menu */}
        <div className="absolute top-2 left-2">
          <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
            {book.genre}
          </span>
          {activeTab === 'reading' && (
            <span className="flex items-center">
              <Clock className="w-3 h-3 ml-1" />
              {book.lastRead}
            </span>
          )}
          {activeTab === 'read' && (
            <span className="flex items-center">
              <CheckCircle className="w-3 h-3 ml-1" />
              {book.finishedDate}
            </span>
          )}
          {activeTab === 'wantToRead' && (
            <span className="flex items-center">
              <Calendar className="w-3 h-3 ml-1" />
              {book.addedDate}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">
            عرض التفاصيل
          </button>
          {activeTab === 'wantToRead' && (
            <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">
              ابدأ القراءة
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const BookListItem = ({ book }: { book: any }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex space-x-6">
      <img
        src={book.cover}
        alt={book.title}
        className="w-20 h-28 object-cover rounded"
        onError={(e) => {
          e.currentTarget.src = `https://via.placeholder.com/80x112/6366f1/white?text=${encodeURIComponent(book.title.charAt(0))}`;
        }}
      />
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        {activeTab === 'reading' && book.progress && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>التقدم: {book.progress}%</span>
              <span>{book.currentPage} من {book.totalPages} صفحة</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {activeTab === 'read' && book.rating && (
          <div className="flex items-center mb-2">
            {renderStars(book.rating)}
            {book.review && (
              <span className="mr-3 text-sm text-gray-600">"{book.review}"</span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {book.genre}
            </span>
            {activeTab === 'reading' && (
              <span className="flex items-center">
                <Clock className="w-3 h-3 ml-1" />
                آخر قراءة: {book.lastRead}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded" title="عرض">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="تعديل">
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="حذف">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation currentPage="library" />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مكتبتي</h1>
          <p className="text-gray-600">إدارة كتبك وتتبع تقدم قراءتك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-purple-600">{stats.totalBooks}</div>
            <div className="text-sm text-gray-600">إجمالي الكتب</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-green-600">{stats.booksRead}</div>
            <div className="text-sm text-gray-600">مقروءة</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600">{stats.currentlyReading}</div>
            <div className="text-sm text-gray-600">أقرأ حالياً</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-orange-600">{stats.wantToRead}</div>
            <div className="text-sm text-gray-600">أريد قراءته</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-indigo-600">{stats.pagesRead}</div>
            <div className="text-sm text-gray-600">صفحة مقروءة</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">متوسط التقييم</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في مكتبتك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
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

              {/* Add Book Button */}
              <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>إضافة كتاب</span>
              </button>
            </div>
          </div>
        </div>

        {/* Books Display */}
        <div className="mb-6">
          <p className="text-gray-600">
            عرض {getCurrentBooks().length} كتاب
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getCurrentBooks().map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {getCurrentBooks().map(book => (
              <BookListItem key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {getCurrentBooks().length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? 'لم يتم العثور على كتب' : 'لا توجد كتب في هذا القسم'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'جرب تغيير مصطلح البحث' : 'ابدأ بإضافة كتب إلى مكتبتك'}
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              إضافة كتاب جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
