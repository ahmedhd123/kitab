'use client';

import { useState } from 'react';

const sampleBooks = [
  {
    title: "كبرياء وتحامل",
    author: "جين أوستن", 
    year: 1813,
    genre: "رومانسية",
    description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية في إنجلترا الجورجية.",
    rating: 4.8,
    pages: 432,
    coverImage: "https://via.placeholder.com/300x400?text=كبرياء+وتحامل"
  },
  {
    title: "غاتسبي العظيم",
    author: "ف. سكوت فيتزجيرالد",
    year: 1925,
    genre: "أدب أمريكي", 
    description: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
    rating: 4.6,
    pages: 180,
    coverImage: "https://via.placeholder.com/300x400?text=غاتسبي+العظيم"
  },
  {
    title: "مئة عام من العزلة",
    author: "غابرييل غارسيا ماركيز",
    year: 1967,
    genre: "أدب لاتيني",
    description: "رواية سحرية واقعية تحكي قصة عائلة بوينديا عبر ستة أجيال.",
    rating: 4.9,
    pages: 417,
    coverImage: "https://via.placeholder.com/300x400?text=مئة+عام+من+العزلة"
  },
  {
    title: "أسود الأرض",
    author: "عبد الرحمن منيف",
    year: 1984,
    genre: "أدب عربي",
    description: "رواية عربية تتناول التحولات الاجتماعية والاقتصادية في المنطقة العربية.",
    rating: 4.7,
    pages: 590,
    coverImage: "https://via.placeholder.com/300x400?text=أسود+الأرض"
  },
  {
    title: "موسم الهجرة إلى الشمال",
    author: "الطيب صالح",
    year: 1966,
    genre: "أدب عربي",
    description: "رواية سودانية تتناول موضوع الهوية والاستعمار والصراع الثقافي.",
    rating: 4.5,
    pages: 169,
    coverImage: "https://via.placeholder.com/300x400?text=موسم+الهجرة+إلى+الشمال"
  },
  {
    title: "رجال في الشمس",
    author: "غسان كنفاني",
    year: 1963,
    genre: "أدب عربي",
    description: "رواية فلسطينية تحكي معاناة اللاجئين الفلسطينيين.",
    rating: 4.4,
    pages: 96,
    coverImage: "https://via.placeholder.com/300x400?text=رجال+في+الشمس"
  },
  {
    title: "الأسود يليق بك",
    author: "أحلام مستغانمي",
    year: 2012,
    genre: "أدب عربي",
    description: "رواية عربية معاصرة تتناول قضايا المرأة والمجتمع.",
    rating: 4.3,
    pages: 354,
    coverImage: "https://via.placeholder.com/300x400?text=الأسود+يليق+بك"
  },
  {
    title: "ذاكرة الجسد",
    author: "أحلام مستغانمي",
    year: 1993,
    genre: "أدب عربي",
    description: "رواية عربية تتناول الحب والحرب والذاكرة.",
    rating: 4.6,
    pages: 419,
    coverImage: "https://via.placeholder.com/300x400?text=ذاكرة+الجسد"
  }
];

export default function TestDatabasePage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('جاري اختبار الاتصال...');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus('✅ الاتصال بالخادم ناجح: ' + JSON.stringify(data, null, 2));
      } else {
        setStatus('❌ فشل الاتصال: ' + data.message);
      }
    } catch (error) {
      setStatus('❌ خطأ في الاتصال: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    }
    
    setLoading(false);
  };

  const checkBooks = async () => {
    setLoading(true);
    setStatus('جاري جلب الكتب...');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus('✅ البيانات المتاحة: ' + JSON.stringify(data, null, 2));
      } else {
        setStatus('❌ فشل جلب البيانات: ' + data.message);
      }
    } catch (error) {
      setStatus('❌ خطأ في جلب البيانات: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    }
    
    setLoading(false);
  };

  const createAdmin = async () => {
    setLoading(true);
    setStatus('جاري إنشاء مستخدم المدير...');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'admin',
          email: 'admin@kitabi.com',
          password: 'admin123',
          name: 'مدير النظام'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('✅ تم إنشاء مستخدم المدير بنجاح: ' + JSON.stringify(data, null, 2));
      } else {
        setStatus('❌ فشل إنشاء المدير: ' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setStatus('❌ خطأ في إنشاء المدير: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">اختبار قاعدة البيانات</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">اختبارات الاتصال</h2>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              اختبار الاتصال بالخادم
            </button>
            
            <button
              onClick={checkBooks}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 mr-4"
            >
              فحص بيانات الكتب
            </button>
            
            <button
              onClick={createAdmin}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 mr-4"
            >
              إنشاء مستخدم مدير
            </button>
          </div>
        </div>
        
        {status && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">النتائج:</h3>
            <pre className="whitespace-pre-wrap text-sm">{status}</pre>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">بيانات الكتب التجريبية</h2>
          <p className="text-gray-600 mb-4">
            عدد الكتب المتاحة: {sampleBooks.length}
          </p>
          
          <div className="grid gap-4">
            {sampleBooks.map((book, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-gray-600">المؤلف: {book.author}</p>
                <p className="text-gray-600">التصنيف: {book.genre}</p>
                <p className="text-gray-600">التقييم: {book.rating}/5</p>
                <p className="text-gray-500 text-sm mt-2">{book.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL}
          </p>
        </div>
      </div>
    </div>
  );
}
