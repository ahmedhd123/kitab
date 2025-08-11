'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestConnectionPage() {
  const [status, setStatus] = useState({
    backend: 'checking',
    auth: 'checking',
    sampleData: 'checking'
  });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    // Test Backend Health
    try {
      addLog('Testing backend connection...');
      const healthResponse = await fetch('http://localhost:5000/api/health');
      if (healthResponse.ok) {
        setStatus(prev => ({ ...prev, backend: 'success' }));
        addLog('✅ Backend connection successful');
      } else {
        setStatus(prev => ({ ...prev, backend: 'error' }));
        addLog('❌ Backend health check failed');
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, backend: 'error' }));
      addLog('❌ Backend connection failed: ' + error);
    }

    // Test Auth Endpoint
    try {
      addLog('Testing authentication endpoint...');
      const authResponse = await fetch('http://localhost:5000/api/auth/health');
      if (authResponse.ok) {
        const authData = await authResponse.json();
        setStatus(prev => ({ ...prev, auth: 'success' }));
        addLog(`✅ Auth endpoint working - Sample users: ${authData.sampleUsersLoaded}`);
      } else {
        setStatus(prev => ({ ...prev, auth: 'error' }));
        addLog('❌ Auth endpoint failed');
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, auth: 'error' }));
      addLog('❌ Auth test failed: ' + error);
    }

    // Test Sample Login
    try {
      addLog('Testing admin login...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@kitabi.com',
          password: 'admin123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        setStatus(prev => ({ ...prev, sampleData: 'success' }));
        addLog(`✅ Admin login successful - Role: ${loginData.user.role}`);
      } else {
        const errorData = await loginResponse.json();
        setStatus(prev => ({ ...prev, sampleData: 'error' }));
        addLog(`❌ Admin login failed: ${errorData.message}`);
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, sampleData: 'error' }));
      addLog('❌ Sample login test failed: ' + error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'checking': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'checking': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔧 اختبار اتصال النظام
            </h1>
            <p className="text-gray-600">
              تشخيص حالة الخوادم ونظام المصادقة
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Backend Status */}
            <div className={`p-6 rounded-lg border-2 ${getStatusColor(status.backend)}`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{getStatusIcon(status.backend)}</div>
                <h3 className="text-lg font-semibold mb-1">الخادم الخلفي</h3>
                <p className="text-sm">localhost:5000</p>
              </div>
            </div>

            {/* Auth Status */}
            <div className={`p-6 rounded-lg border-2 ${getStatusColor(status.auth)}`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{getStatusIcon(status.auth)}</div>
                <h3 className="text-lg font-semibold mb-1">نظام المصادقة</h3>
                <p className="text-sm">JWT + Sample Data</p>
              </div>
            </div>

            {/* Sample Data Status */}
            <div className={`p-6 rounded-lg border-2 ${getStatusColor(status.sampleData)}`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{getStatusIcon(status.sampleData)}</div>
                <h3 className="text-lg font-semibold mb-1">البيانات النموذجية</h3>
                <p className="text-sm">Admin Login Test</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <button
              onClick={testConnection}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 إعادة الاختبار
            </button>
            
            <Link
              href="/auth/login"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              🔐 تسجيل الدخول
            </Link>
            
            <Link
              href="/admin"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              ⚙️ لوحة الإدارة
            </Link>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <h3 className="text-white mb-3 font-bold">📝 سجل الاختبارات:</h3>
            <div className="h-64 overflow-y-auto space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-3 text-right">
              🔑 بيانات دخول المدير:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-right">
              <div>
                <p className="text-sm text-blue-700 font-medium">البريد الإلكتروني:</p>
                <p className="font-mono text-blue-900 bg-blue-100 p-2 rounded">
                  admin@kitabi.com
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">كلمة المرور:</p>
                <p className="font-mono text-blue-900 bg-blue-100 p-2 rounded">
                  admin123
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 روابط سريعة:</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="http://localhost:5000/api/health"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Backend Health
              </a>
              <a
                href="http://localhost:5000/api/auth/health"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Auth Health
              </a>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Frontend Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
