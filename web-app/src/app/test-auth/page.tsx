'use client';

import { useState } from 'react';

export default function TestAuthPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      // First, try to login to get a token
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@kitabi.com',
          password: 'admin123'
        })
      });

      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        setResult(`Login successful! Token: ${loginData.data.token}`);
        
        // Store token
        localStorage.setItem('token', loginData.data.token);
        
        // Now try to upload a book
        setTimeout(async () => {
          const formData = new FormData();
          formData.append('title', 'كتاب تجريبي');
          formData.append('author', 'مؤلف تجريبي');
          formData.append('description', 'وصف تجريبي للكتاب');
          formData.append('genre', 'أدب');
          formData.append('language', 'arabic');
          
          const bookResponse = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${loginData.data.token}`
            },
            body: formData
          });

          const bookData = await bookResponse.json();
          setResult(prev => prev + `\n\nBook upload result: ${bookResponse.status} - ${JSON.stringify(bookData)}`);
        }, 1000);
        
      } else {
        setResult(`Login failed: ${JSON.stringify(loginData)}`);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">اختبار المصادقة و API</h1>
        
        <button
          onClick={testAuth}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'جاري الاختبار...' : 'اختبار تسجيل الدخول ورفع الكتاب'}
        </button>
        
        {result && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">النتائج:</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded overflow-x-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
