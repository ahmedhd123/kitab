'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  CheckCircleIcon,
  BookOpenIcon,
  ArrowRightIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const BookSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  
  const bookId = searchParams.get('id');
  const action = searchParams.get('action'); // 'created' or 'published'
  const title = searchParams.get('title');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (bookId) {
            router.push(`/admin/books/${bookId}`);
          } else {
            router.push('/admin/books');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, bookId]);

  const goToBookDetails = () => {
    if (bookId) {
      router.push(`/admin/books/${bookId}`);
    } else {
      router.push('/admin/books');
    }
  };

  const goToEditBook = () => {
    if (bookId) {
      router.push(`/admin/books/${bookId}/edit`);
    }
  };

  const goToBooksList = () => {
    router.push('/admin/books');
  };

  const getSuccessMessage = () => {
    if (action === 'published') {
      return {
        title: 'تم نشر الكتاب بنجاح!',
        message: 'الكتاب متاح الآن للقراء في المكتبة العامة',
        icon: 'success'
      };
    } else {
      return {
        title: 'تم حفظ الكتاب بنجاح!',
        message: 'تم حفظ الكتاب كمسودة. يمكنك تعديله أو نشره لاحقاً',
        icon: 'draft'
      };
    }
  };

  const successInfo = getSuccessMessage();

  return (
    <AdminLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {successInfo.title}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {successInfo.message}
            </p>

            {/* Book Info */}
            {title && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center text-blue-800">
                  <BookOpenIcon className="h-5 w-5 ml-2" />
                  <span className="font-medium">{decodeURIComponent(title)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={goToBookDetails}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <EyeIcon className="h-5 w-5 ml-2" />
                عرض تفاصيل الكتاب
              </button>

              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={goToEditBook}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
                >
                  <PencilIcon className="h-4 w-4 ml-1" />
                  تعديل
                </button>
                
                <button
                  onClick={goToBooksList}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                  قائمة الكتب
                </button>
              </div>
            </div>

            {/* Auto Redirect Countdown */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                سيتم توجيهك تلقائياً إلى صفحة التفاصيل خلال{' '}
                <span className="font-bold text-blue-600">{countdown}</span> ثواني
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const BookSuccessPage = () => {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    }>
      <BookSuccessContent />
    </Suspense>
  );
};

export default BookSuccessPage;
