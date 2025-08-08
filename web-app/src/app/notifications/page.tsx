'use client';

import { useState } from 'react';
import { 
  Bell, 
  BookOpen, 
  User, 
  Heart, 
  MessageSquare, 
  Settings,
  Check,
  Trash2,
  Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'review' | 'follow' | 'like' | 'comment' | 'recommendation';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'follow',
      title: 'متابع جديد',
      message: 'أحمد محمد بدأ في متابعتك',
      time: 'منذ دقيقتين',
      read: false
    },
    {
      id: '2',
      type: 'like',
      title: 'إعجاب بمراجعتك',
      message: 'سارة أعجبت بمراجعتك لكتاب "مئة عام من العزلة"',
      time: 'منذ 5 دقائق',
      read: false
    },
    {
      id: '3',
      type: 'comment',
      title: 'تعليق جديد',
      message: 'علق محمد على مراجعتك: "مراجعة رائعة، شكراً لك"',
      time: 'منذ 15 دقيقة',
      read: true
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'توصية جديدة',
      message: 'لدينا كتاب جديد قد يعجبك: "الخيميائي"',
      time: 'منذ ساعة',
      read: true
    },
    {
      id: '5',
      type: 'review',
      title: 'مراجعة جديدة',
      message: 'فاطمة كتبت مراجعة لكتاب في قائمة قراءتك',
      time: 'منذ ساعتين',
      read: false
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'like':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'recommendation':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      case 'review':
        return <MessageSquare className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'follow':
        return 'bg-blue-100';
      case 'like':
        return 'bg-red-100';
      case 'comment':
        return 'bg-green-100';
      case 'recommendation':
        return 'bg-purple-100';
      case 'review':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الإشعارات</h1>
            <p className="text-gray-600">
              لديك {unreadCount} إشعار غير مقروء
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              تعليم الكل كمقروء
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-1">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'unread', label: 'غير مقروءة' },
              { id: 'follow', label: 'متابعات' },
              { id: 'like', label: 'إعجابات' },
              { id: 'comment', label: 'تعليقات' },
              { id: 'recommendation', label: 'توصيات' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات</h3>
              <p className="text-gray-600">لم تستلم أي إشعارات حتى الآن</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg p-4 shadow-sm border-r-4 transition-all hover:shadow-md ${
                  notification.read ? 'border-gray-300' : 'border-indigo-500 bg-indigo-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-right">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mr-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="تعليم كمقروء"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف الإشعار"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-white text-gray-600 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              تحميل المزيد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
