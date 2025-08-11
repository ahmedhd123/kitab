'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  Heart, 
  Users, 
  TrendingUp,
  Calendar,
  Award,
  Settings,
  Camera,
  Edit3,
  Book,
  Target,
  BarChart3
} from 'lucide-react';
import Navigation from '../../../components/Navigation';

export default async function UserProfile({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const [activeTab, setActiveTab] = useState('books');
  const [isOwnProfile] = useState(true); // للتبسيط، نفترض أنه ملف المستخدم الحالي

  // بيانات وهمية للمستخدم
  const user = {
    id: params.id,
    name: "سارة أحمد",
    username: "sara_reader",
    bio: "محبة للأدب العربي والكتب الكلاسيكية. أؤمن بأن الكتاب هو أفضل صديق للإنسان.",
    avatar: "/user-avatar-placeholder.jpg",
    joinDate: "2023-01-15",
    location: "الرياض، السعودية",
    website: "https://sara-blog.com",
    stats: {
      booksRead: 127,
      booksReading: 3,
      booksWantToRead: 45,
      followers: 234,
      following: 156,
      reviews: 89
    },
    badges: [
      { name: "قارئ نهم", icon: "📚", description: "قرأ أكثر من 100 كتاب" },
      { name: "ناقد محترف", icon: "⭐", description: "كتب أكثر من 50 مراجعة" },
      { name: "مؤثر اجتماعي", icon: "👥", description: "لديه أكثر من 200 متابع" }
    ],
    currentlyReading: [
      {
        id: 1,
        title: "مئة عام من العزلة",
        author: "غابرييل غارسيا ماركيز",
        cover: "/book1.jpg",
        progress: 65
      },
      {
        id: 2,
        title: "البحث عن الوقت المفقود",
        author: "مارسيل بروست",
        cover: "/book2.jpg",
        progress: 23
      }
    ],
    recentBooks: [
      {
        id: 1,
        title: "الأسود يليق بك",
        author: "أحلام مستغانمي",
        cover: "/book3.jpg",
        rating: 5,
        dateRead: "2024-01-15"
      },
      {
        id: 2,
        title: "كافكا على الشاطئ",
        author: "هاروكي موراكامي",
        cover: "/book4.jpg",
        rating: 4,
        dateRead: "2024-01-10"
      }
    ]
  };

  const yearlyGoal = {
    target: 50,
    completed: 12,
    remaining: 38
  };

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

  const TabButton = ({ tab, label, isActive }: { tab: string; label: string; isActive: boolean }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-purple-600 text-white'
          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/128x128/6366f1/white?text=${encodeURIComponent(user.name.charAt(0))}`;
                }}
              />
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>
                {isOwnProfile ? (
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                    <Edit3 className="w-4 h-4 ml-2" />
                    تعديل الملف
                  </button>
                ) : (
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    متابعة
                  </button>
                )}
              </div>

              <p className="text-gray-700 mb-4">{user.bio}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 ml-1" />
                  انضم في {new Date(user.joinDate).toLocaleDateString('ar-SA')}
                </div>
                <div className="flex items-center">
                  <span>📍</span>
                  <span className="mr-1">{user.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.booksRead}</div>
                  <div className="text-sm text-gray-600">كتاب مقروء</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.booksReading}</div>
                  <div className="text-sm text-gray-600">يقرأ حالياً</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.booksWantToRead}</div>
                  <div className="text-sm text-gray-600">يريد قراءته</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.followers}</div>
                  <div className="text-sm text-gray-600">متابع</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.following}</div>
                  <div className="text-sm text-gray-600">يتابع</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.reviews}</div>
                  <div className="text-sm text-gray-600">مراجعة</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                <TabButton tab="books" label="مكتبتي" isActive={activeTab === 'books'} />
                <TabButton tab="reading" label="أقرأ حالياً" isActive={activeTab === 'reading'} />
                <TabButton tab="reviews" label="مراجعاتي" isActive={activeTab === 'reviews'} />
                <TabButton tab="activity" label="النشاطات" isActive={activeTab === 'activity'} />
              </div>

              {/* Tab Content */}
              {activeTab === 'books' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {user.recentBooks.map((book) => (
                    <div key={book.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/64x96/6366f1/white?text=${encodeURIComponent(book.title.charAt(0))}`;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{book.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                        <div className="flex items-center mb-2">
                          {renderStars(book.rating)}
                        </div>
                        <p className="text-xs text-gray-500">قرأته في {book.dateRead}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reading' && (
                <div className="space-y-6">
                  {user.currentlyReading.map((book) => (
                    <div key={book.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/64x96/6366f1/white?text=${encodeURIComponent(book.title.charAt(0))}`;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{book.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>التقدم في القراءة</span>
                            <span>{book.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-8">
                  <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لم تتم كتابة أي مراجعات بعد</p>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد نشاطات حديثة</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Reading Goal */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 ml-2 text-purple-600" />
                هدف القراءة لعام 2024
              </h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-600">
                  {yearlyGoal.completed}/{yearlyGoal.target}
                </div>
                <p className="text-gray-600">كتاب</p>
              </div>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(yearlyGoal.completed / yearlyGoal.target) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                متبقي {yearlyGoal.remaining} كتاب لتحقيق هدفك
              </p>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 ml-2 text-purple-600" />
                الإنجازات
              </h3>
              <div className="space-y-3">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            {isOwnProfile && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">إجراءات سريعة</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Settings className="w-5 h-5 ml-3 text-gray-600" />
                    إعدادات الحساب
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Users className="w-5 h-5 ml-3 text-gray-600" />
                    إدارة المتابعين
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <TrendingUp className="w-5 h-5 ml-3 text-gray-600" />
                    إحصائيات القراءة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
