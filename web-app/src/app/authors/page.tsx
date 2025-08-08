'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, BookOpen, Star } from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function AuthorsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const authors = [
    {
      id: 1,
      name: "أحلام مستغانمي",
      bio: "كاتبة وروائية جزائرية معاصرة، تُعتبر من أهم الكاتبات في الأدب العربي الحديث",
      booksCount: 8,
      followersCount: 125000,
      rating: 4.6,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      topBooks: ["ذاكرة الجسد", "فوضى الحواس", "عابر سرير"]
    },
    {
      id: 2,
      name: "نجيب محفوظ",
      bio: "أديب مصري حائز على جائزة نوبل للآداب، من أهم كتاب الرواية العربية في القرن العشرين",
      booksCount: 34,
      followersCount: 89000,
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      topBooks: ["الثلاثية", "أولاد حارتنا", "اللص والكلاب"]
    },
    {
      id: 3,
      name: "غادة السمان",
      bio: "كاتبة وصحفية سورية، رائدة في الأدب النسوي العربي المعاصر",
      booksCount: 15,
      followersCount: 67000,
      rating: 4.4,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=200&h=200&fit=crop&crop=face",
      topBooks: ["بيروت 75", "كوابيس بيروت", "الرقص مع البوم"]
    },
    {
      id: 4,
      name: "محمد شكري",
      bio: "كاتب مغربي اشتهر بسيرته الذاتية 'الخبز الحافي' التي تُرجمت لعدة لغات",
      booksCount: 12,
      followersCount: 45000,
      rating: 4.2,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      topBooks: ["الخبز الحافي", "الشطار", "وجوه"]
    }
  ];

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i <= fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">المؤلفون</h1>
          <p className="text-gray-600">اكتشف كتابك المفضلين واتبع أعمالهم الجديدة</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن مؤلف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              dir="rtl"
            />
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map(author => (
            <Link key={author.id} href={`/author/${author.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="text-center mb-4">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{author.name}</h3>
                
                <div className="flex items-center justify-center mb-2">
                  {renderStars(author.rating)}
                  <span className="mr-2 text-sm text-gray-600">{author.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{author.bio}</p>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 ml-1" />
                  <span>{author.booksCount} كتاب</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 ml-1" />
                  <span>{author.followersCount.toLocaleString()} متابع</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">أشهر الأعمال:</h4>
                <div className="flex flex-wrap gap-1">
                  {author.topBooks.slice(0, 2).map((book, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {book}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors">
                عرض الملف الشخصي
              </button>
            </Link>
          ))}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لم يتم العثور على مؤلفين</h3>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </div>
  );
}
