'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, BookOpen } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend API
    console.log('رسالة تواصل:', formData);
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو اقتراح
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">معلومات التواصل</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-gray-900">البريد الإلكتروني</h3>
                    <p className="text-gray-600">support@kitabi.com</p>
                    <p className="text-gray-600">info@kitabi.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-gray-900">الهاتف</h3>
                    <p className="text-gray-600">+966 50 123 4567</p>
                    <p className="text-gray-600">+966 11 456 7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-gray-900">العنوان</h3>
                    <p className="text-gray-600">
                      المملكة العربية السعودية<br />
                      الرياض، حي الملك فهد<br />
                      طريق الملك عبد العزيز
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 text-right">ساعات العمل</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>9:00 ص - 6:00 م</span>
                    <span>الأحد - الخميس</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مغلق</span>
                    <span>الجمعة - السبت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">أرسل رسالة</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                      placeholder="محمد أحمد"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    موضوع الرسالة
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="">اختر موضوع الرسالة</option>
                    <option value="general">استفسار عام</option>
                    <option value="technical">مشكلة تقنية</option>
                    <option value="suggestion">اقتراح</option>
                    <option value="partnership">شراكة</option>
                    <option value="complaint">شكوى</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    نص الرسالة
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                    placeholder="اكتب رسالتك هنا..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-right">الأسئلة الشائعة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-right">كيف يمكنني إضافة كتاب جديد؟</h3>
                  <p className="text-gray-600 text-right">
                    يمكنك إضافة كتاب جديد من خلال صفحة "إضافة كتاب" في القائمة الرئيسية
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-right">هل يمكنني تعديل مراجعاتي؟</h3>
                  <p className="text-gray-600 text-right">
                    نعم، يمكنك تعديل أو حذف مراجعاتك في أي وقت من صفحة ملفك الشخصي
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-right">كيف تعمل التوصيات الذكية؟</h3>
                  <p className="text-gray-600 text-right">
                    نستخدم الذكاء الاصطناعي لتحليل قراءاتك وتفضيلاتك لنقترح عليك كتباً مناسبة
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-right">هل التطبيق مجاني؟</h3>
                  <p className="text-gray-600 text-right">
                    نعم، التطبيق مجاني بالكامل مع جميع الميزات المتاحة
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-right">كيف يمكنني حذف حسابي؟</h3>
                  <p className="text-gray-600 text-right">
                    يمكنك حذف حسابك من صفحة الإعدادات، قسم "منطقة الخطر"
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-right">هل بياناتي آمنة؟</h3>
                  <p className="text-gray-600 text-right">
                    نحن نحرص على حماية بياناتك وفقاً لأعلى معايير الأمان والخصوصية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
