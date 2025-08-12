'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Eye, Book, Globe, Filter, RefreshCw, FileText } from 'lucide-react';

interface FreeBook {
  source: string;
  id: string;
  title: string;
  author: string;
  description: string;
  language: string;
  cover?: string;
  formats: Record<string, string>;
  metadata: {
    publication_date?: string;
    subjects?: string[];
    rights?: string;
  };
}

const FreeBooksImport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchResults, setSearchResults] = useState<FreeBook[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<FreeBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<string[]>([]);

  const sources = {
    all: 'جميع المصادر',
    gutenberg: 'Project Gutenberg',
    standard_ebooks: 'Standard Ebooks',
    hindawi: 'مؤسسة هنداوي',
    noor: 'مكتبة نور',
    archive_org: 'Internet Archive'
  };

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  const loadFeaturedBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/freebooks/featured?limit=12', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeaturedBooks(data.data || []);
      }
    } catch (error) {
      console.error('Error loading featured books:', error);
    }
  };

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/freebooks/search?query=${encodeURIComponent(searchQuery)}&source=${selectedSource}&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data?.books || []);
      } else {
        const error = await response.json();
        alert(error.message || 'خطأ في البحث');
      }
    } catch (error) {
      console.error('Error searching books:', error);
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setIsSearching(false);
    }
  };

  const importBook = async (book: FreeBook) => {
    setIsImporting(book.id);
    try {
      const response = await fetch('http://localhost:5000/api/freebooks/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookData: book,
          downloadFiles: true
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setImportResults(prev => [...prev, `✅ ${book.title} - تم الاستيراد بنجاح`]);
        // Remove from search results
        setSearchResults(prev => prev.filter(b => b.id !== book.id));
      } else {
        setImportResults(prev => [...prev, `❌ ${book.title} - ${result.message}`]);
      }
    } catch (error) {
      console.error('Error importing book:', error);
      setImportResults(prev => [...prev, `❌ ${book.title} - خطأ في الاستيراد`]);
    } finally {
      setIsImporting(null);
    }
  };

  const BookCard: React.FC<{ book: FreeBook; showImport?: boolean }> = ({ book, showImport = false }) => {
    const formatIcons = {
      epub: Book,
      pdf: FileText,
      mobi: Book,
      txt: FileText
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
              <Book className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">{book.author}</p>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{book.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {sources[book.source as keyof typeof sources] || book.source}
              </span>
              <span>{book.language === 'ar' ? 'عربي' : book.language}</span>
              {book.metadata.publication_date && (
                <span>{new Date(book.metadata.publication_date).getFullYear()}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {Object.keys(book.formats).map(format => {
                  const Icon = formatIcons[format as keyof typeof formatIcons] || Book;
                  return (
                    <span
                      key={format}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      <Icon className="w-3 h-3" />
                      {format.toUpperCase()}
                    </span>
                  );
                })}
              </div>

              {showImport && (
                <button
                  onClick={() => importBook(book)}
                  disabled={isImporting === book.id}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {isImporting === book.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الاستيراد...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      استيراد
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">استيراد الكتب المجانية</h1>
        <p className="text-gray-600">ابحث واستورد كتب من المصادر المجانية المختلفة</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">البحث عن الكتب</h2>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBooks()}
              placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(sources).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <button
            onClick={searchBooks}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري البحث...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                بحث
              </>
            )}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              نتائج البحث ({searchResults.length})
            </h3>
            <div className="space-y-4">
              {searchResults.map((book) => (
                <BookCard key={book.id} book={book} showImport={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Import Results */}
      {importResults.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">نتائج الاستيراد</h2>
            <button
              onClick={() => setImportResults([])}
              className="text-gray-500 hover:text-gray-700"
            >
              مسح
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {importResults.map((result, index) => (
              <div key={index} className="text-sm py-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Books */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">الكتب المميزة</h2>
          <button
            onClick={loadFeaturedBooks}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
        </div>
        
        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} showImport={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد كتب مميزة متاحة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeBooksImport;
