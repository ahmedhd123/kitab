'use client';

import { useState } from 'react';
import { apiUrl } from '@/utils/api';

export default function TestApiPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name: string, endpoint: string, options: any = {}) => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });
      
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          success: response.ok,
          data: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          status: 'error',
          success: false,
          error: error.message
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@kitabi.com',
          password: 'admin123'
        })
      });
      
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        login: {
          status: response.status,
          success: response.ok,
          data: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        login: {
          status: 'error',
          success: false,
          error: error.message
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">اختبار API</h1>
        
        <div className="grid gap-4 mb-8">
          <button
            onClick={() => testEndpoint('health', 'health')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            اختبار Health API
          </button>
          
          <button
            onClick={() => testEndpoint('books', 'books')}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            اختبار Books API
          </button>
          
          <button
            onClick={testLogin}
            className="bg-purple-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            اختبار تسجيل الدخول
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">النتائج:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded">
          <h3 className="font-bold mb-2">معلومات API:</h3>
          <p>Base URL: {process.env.NEXT_PUBLIC_API_URL || '/api'}</p>
          <p>Health URL: {apiUrl('health')}</p>
          <p>Books URL: {apiUrl('books')}</p>
          <p>Login URL: {apiUrl('auth/login')}</p>
        </div>
      </div>
    </div>
  );
}
