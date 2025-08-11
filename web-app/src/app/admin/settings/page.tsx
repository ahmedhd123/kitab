'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  allowUserRegistration: boolean;
  requireEmailVerification: boolean;
  allowBookUploads: boolean;
  maxFileSize: number;
  supportedFormats: string[];
  featuredBooksCount: number;
  enableAI: boolean;
  maintenanceMode: boolean;
  backupSchedule: string;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: '',
    siteDescription: '',
    allowUserRegistration: true,
    requireEmailVerification: false,
    allowBookUploads: true,
    maxFileSize: 50,
    supportedFormats: [],
    featuredBooksCount: 6,
    enableAI: true,
    maintenanceMode: false,
    backupSchedule: 'daily'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل الإعدادات');
      }

      const data = await response.json();
      setSettings(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ الإعدادات');
      }

      setSuccess('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFormatToggle = (format: string) => {
    setSettings(prev => ({
      ...prev,
      supportedFormats: prev.supportedFormats.includes(format)
        ? prev.supportedFormats.filter(f => f !== format)
        : [...prev.supportedFormats, format]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 rtl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="rtl">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">إعدادات النظام</h1>
                <p className="text-gray-600 mt-1">إدارة إعدادات وتكوين المنصة</p>
              </div>
              <div className="flex space-x-4 space-x-reverse">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">الإعدادات العامة</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الموقع</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="كتابي - Kitabi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وصف الموقع</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="منصة اجتماعية للكتب مع ذكاء اصطناعي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عدد الكتب المميزة</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.featuredBooksCount}
                  onChange={(e) => setSettings(prev => ({ ...prev, featuredBooksCount: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">عدد الكتب التي تظهر في القسم المميز</p>
              </div>
            </div>
          </div>

          {/* User Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">إعدادات المستخدمين</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">السماح بتسجيل مستخدمين جدد</label>
                  <p className="text-sm text-gray-500">تمكين أو تعطيل تسجيل حسابات جديدة</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowUserRegistration}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowUserRegistration: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">التحقق من البريد الإلكتروني مطلوب</label>
                  <p className="text-sm text-gray-500">يتطلب من المستخدمين تأكيد بريدهم الإلكتروني</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings(prev => ({ ...prev, requireEmailVerification: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">إعدادات تحميل الملفات</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">السماح برفع الكتب</label>
                  <p className="text-sm text-gray-500">تمكين المستخدمين من رفع ملفات الكتب</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowBookUploads}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowBookUploads: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى لحجم الملف (ميجابايت)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">صيغ الملفات المدعومة</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['epub', 'mobi', 'pdf', 'txt', 'doc', 'docx'].map((format) => (
                    <div key={format} className="flex items-center">
                      <input
                        type="checkbox"
                        id={format}
                        checked={settings.supportedFormats.includes(format)}
                        onChange={() => handleFormatToggle(format)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={format} className="mr-2 text-sm text-gray-700 uppercase">
                        {format}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">إعدادات الذكاء الاصطناعي</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">تفعيل خدمات الذكاء الاصطناعي</label>
                  <p className="text-sm text-gray-500">تمكين التوصيات والتحليل الذكي والملخصات</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableAI}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableAI: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              {settings.enableAI && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">الخدمات المفعلة:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• توصيات الكتب الذكية</li>
                    <li>• تحليل المشاعر للمراجعات</li>
                    <li>• تحليل المزاج للكتب</li>
                    <li>• توليد الملخصات التلقائية</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">إعدادات النظام</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">وضع الصيانة</label>
                  <p className="text-sm text-gray-500">تعطيل الموقع مؤقتاً للصيانة</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
              </div>
              
              {settings.maintenanceMode && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">
                    ⚠️ تحذير: تفعيل وضع الصيانة سيمنع الوصول للموقع من جميع المستخدمين عدا المديرين
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">جدولة النسخ الاحتياطية</label>
                <select
                  value={settings.backupSchedule}
                  onChange={(e) => setSettings(prev => ({ ...prev, backupSchedule: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">يومية</option>
                  <option value="weekly">أسبوعية</option>
                  <option value="monthly">شهرية</option>
                  <option value="manual">يدوية فقط</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">معلومات النظام</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">البيئة</h4>
                  <p className="text-sm text-gray-600">Development</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">إصدار النظام</h4>
                  <p className="text-sm text-gray-600">v1.0.0</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">آخر نسخة احتياطية</h4>
                  <p className="text-sm text-gray-600">اليوم، 2:30 ص</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">مساحة التخزين المستخدمة</h4>
                  <p className="text-sm text-gray-600">2.3 جيجابايت من 100 جيجابايت</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">إجراءات النظام</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  تشغيل نسخة احتياطية الآن
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  تحديث الفهارس
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  تنظيف التخزين المؤقت
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                تأكد من حفظ التغييرات قبل المغادرة
              </p>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
