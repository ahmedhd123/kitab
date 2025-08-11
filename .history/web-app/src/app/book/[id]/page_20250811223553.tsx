'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Star, 
  Heart, 
  Share2, 
  MessageCircle, 
  User, 
  Calendar,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Flag,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import BookReaderComponent from '@/components/BookReaderComponent';
import { useBook } from '../../../hooks/useBook';

export default function BookDetails({ params }: { params: Promise<{ id: string }> }) {
  const [userRating, setUserRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookId, setBookId] = useState<string | null>(null);

  // Handle async params
  useEffect(() => {
    params.then((resolvedParams) => {
      setBookId(resolvedParams.id);
    });
  }, [params]);

  const { book, loading, error } = useBook(bookId || '');

  // Don't show loading state if we don't have a bookId yet
  const shouldShowLoading = loading && !!bookId;

  const reviews = [
    {
      id: 1,
      user: "فاطمة أحمد",
      rating: 5,
      date: "2024-01-15",
      text: "كتاب رائع ومميز، أسلوب الكاتب جذاب ومشوق.",
      likes: 23,
      replies: 3
    },
    {
      id: 2,
      user: "محمد علي",
      rating: 4,
      date: "2024-01-10",
      text: "قصة جميلة لكن النهاية كانت متوقعة قليلاً.",
      likes: 12,
      replies: 1
    }
  ];

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const stars = [];
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${sizeClass} ${
            i <= rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          } cursor-pointer hover:text-yellow-400`}
          onClick={() => setUserRating(i)}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="animate-pulse">
              <div className="md:flex">
                <div className="md:w-1/3 p-8">
                  <div className="bg-gray-300 w-full max-w-sm mx-auto h-96 rounded-lg"></div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="bg-gray-300 h-8 rounded mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded mb-4 w-3/4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2 w-2/3"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {error || 'الكتاب غير موجود'}
            </h1>
            <p className="text-gray-600 mb-6">
              عذراً، لم نتمكن من العثور على الكتاب المطلوب
            </p>
            <Link 
              href="/"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 p-8">
              <div className="relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/300x450/6366f1/white?text=${encodeURIComponent(book.title)}`;
                  }}
                />
                <button
                  onClick={() => setLiked(!liked)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                  } shadow-lg hover:scale-110 transition-transform`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                  إضافة إلى مكتبتي
                </button>
                <button className="w-full border border-purple-600 text-purple-600 py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors">
                  أريد قراءته
                </button>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Flag className="w-4 h-4" />
                    إبلاغ
                  </button>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">بقلم {book.author}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center ml-4 rtl:ml-0 rtl:mr-4">
                    {renderStars(Math.floor(book.rating || 0))}
                    <span className="mr-2 rtl:mr-0 rtl:ml-2 text-gray-600">
                      {(book.rating || 0).toFixed(1)} ({(book.ratingsCount || 0).toLocaleString()} تقييم)
                    </span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(book.genres || []).map((genre, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Book Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {book.pages || 'غير محدد'} صفحة
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    نُشر في {book.year || 'غير محدد'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Standard Ebooks
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    ISBN: {book.isbn || 'غير محدد'}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">عن الكتاب</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>

                {/* User Rating */}
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-3">قيّم هذا الكتاب</h3>
                  <div className="flex items-center mb-4">
                    <span className="ml-3 rtl:ml-0 rtl:mr-3">تقييمك:</span>
                    <div className="flex">
                      {renderStars(userRating, 'lg')}
                    </div>
                  </div>
                  
                  {userRating > 0 && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      اكتب مراجعة
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="اكتب مراجعتك هنا..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={4}
                      dir="rtl"
                    />
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-3">
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        إلغاء
                      </button>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        نشر المراجعة
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reading Section */}
          <div className="border-t border-gray-200 p-8">
            {book.id ? (
              <BookReaderComponent
                bookId={book.id}
                title={book.title}
                author={book.author}
                digitalFiles={book.digitalFiles || {}}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">جاري تحميل بيانات الكتاب...</p>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              المراجعات ({reviews.length})
            </h3>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center ml-3 rtl:ml-0 rtl:mr-3">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.user}</h4>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="mr-2 rtl:mr-0 rtl:ml-2 text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4" dir="rtl">{review.text}</p>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                    <button className="flex items-center hover:text-purple-600 gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      مفيد ({review.likes})
                    </button>
                    <button className="flex items-center hover:text-purple-600 gap-1">
                      <ThumbsDown className="w-4 h-4" />
                      غير مفيد
                    </button>
                    <button className="flex items-center hover:text-purple-600 gap-1">
                      <MessageCircle className="w-4 h-4" />
                      رد ({review.replies})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}