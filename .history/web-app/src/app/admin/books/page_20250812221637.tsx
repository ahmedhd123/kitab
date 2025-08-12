'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Upload, 
  Book, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  Filter,
  Search,
  Download,
  MoreVertical
} from 'lucide-react';
import BookFileManager from '../../../components/BookFileManager';

interface Book {
  id: string;
  title: string;
  author: string;
  status: 'draft' | 'published' | 'pending';
  createdAt: string;
  downloads: number;
  views: number;
  rating: number;
  hasFiles: {
    epub: boolean;
    mobi: boolean;
    pdf: boolean;
    audiobook: boolean;
  };
}

export default function ManageBooksPage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [showFileManager, setShowFileManager] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات وهمية للكتب
  const [books] = useState<Book[]>([
    {
      id: '1',
      title: 'الأسود يليق بك',
      author: 'أحلام مستغانمي',
      status: 'published',
      createdAt: '2024-01-15',
      downloads: 1247,
      views: 3456,
      rating: 4.3,
      hasFiles: {
        epub: true,
        mobi: true,
        pdf: true,
        audiobook: false
      }
    },
    {
      id: '2',
      title: 'مدن الملح',
      author: 'عبد الرحمن منيف',
      status: 'published',
      createdAt: '2024-01-10',
      downloads: 892,
      views: 2134,
      rating: 4.7,
      hasFiles: {
        epub: true,
        mobi: false,
        pdf: true,
        audiobook: true
      }
    },
    {
      id: '3',
      title: 'كتاب جديد',
      author: 'مؤلف مبتدئ',
      status: 'draft',
      createdAt: '2024-01-20',
      downloads: 0,
      views: 45,
      rating: 0,
      hasFiles: {
        epub: false,
        mobi: false,
        pdf: false,
        audiobook: false
      }
    }
  ]);

  const statusLabels = {
    draft: 'مسودة',
    published: 'منشور',
    pending: 'قيد المراجعة'
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700'
  };

  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === 'all' || book.status === filter;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFileCount = (hasFiles: Book['hasFiles']) => {
    return Object.values(hasFiles).filter(Boolean).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الكتب</h1>
            <p className="text-gray-600">إدارة وتحميل ملفات كتبك الرقمية</p>
          </div>
          <button 
            onClick={() => router.push('/admin/books/new')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة كتاب جديد
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الكتب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
                <option value="pending">قيد المراجعة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Book Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-right flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-gray-600 mb-3">{book.author}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusColors[book.status]}`}>
                      {statusLabels[book.status]}
                    </span>
                  </div>
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{book.downloads}</div>
                    <div className="text-xs text-gray-500">تحميل</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{book.views}</div>
                    <div className="text-xs text-gray-500">مشاهدة</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{book.rating || '—'}</div>
                    <div className="text-xs text-gray-500">تقييم</div>
                  </div>
                </div>
              </div>

              {/* File Status */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    الملفات المتوفرة ({getFileCount(book.hasFiles)}/4)
                  </span>
                  <div className="text-xs text-gray-500">
                    {new Date(book.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { key: 'epub', label: 'EPUB', color: 'green' },
                    { key: 'mobi', label: 'MOBI', color: 'blue' },
                    { key: 'pdf', label: 'PDF', color: 'red' },
                    { key: 'audiobook', label: 'صوتي', color: 'purple' }
                  ].map(({ key, label, color }) => (
                    <div
                      key={key}
                      className={`text-center p-2 rounded text-xs ${
                        book.hasFiles[key as keyof Book['hasFiles']]
                          ? `bg-${color}-100 text-${color}-700`
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedBook(book.id);
                      setShowFileManager(true);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    إدارة الملفات
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    معاينة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* File Manager Modal */}
        {showFileManager && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  إدارة ملفات: {books.find(b => b.id === selectedBook)?.title}
                </h2>
                <button
                  onClick={() => {
                    setShowFileManager(false);
                    setSelectedBook(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">إغلاق</span>
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <BookFileManager bookId={selectedBook} />
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-gray-600 text-sm">إجمالي الكتب</p>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              </div>
              <Book className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-gray-600 text-sm">منشور</p>
                <p className="text-2xl font-bold text-green-600">
                  {books.filter(b => b.status === 'published').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-gray-600 text-sm">إجمالي التحميلات</p>
                <p className="text-2xl font-bold text-blue-600">
                  {books.reduce((sum, book) => sum + book.downloads, 0).toLocaleString()}
                </p>
              </div>
              <Download className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-gray-600 text-sm">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {books.reduce((sum, book) => sum + book.views, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
