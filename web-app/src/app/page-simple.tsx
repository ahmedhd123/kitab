'use client';

import { useSession } from 'next-auth/react';
import KitabiMain from '@/components/KitabiMain';
import NavigationNextAuth from '@/components/NavigationNextAuth';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <NavigationNextAuth />
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">مرحباً بك في كتابي</h1>
            <p className="text-xl mb-8">منصة القراءة الذكية للكتب العربية</p>
            <p className="text-lg">يرجى تسجيل الدخول للمتابعة</p>
          </div>
        </div>
      </>
    );
  }

  return <KitabiMain />;
}
