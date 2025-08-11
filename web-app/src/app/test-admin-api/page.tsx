'use client';

import { useState } from 'react';

export default function TestAdminAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@kitabi.com',
          password: 'admin123'
        })
      });
      const data = await response.json();
      setResult({ type: 'login', status: response.status, data });
      
      // If login successful, test dashboard
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setTimeout(() => testDashboard(data.token), 1000);
      }
    } catch (error) {
      setResult({ type: 'login', error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  const testDashboard = async (token?: string) => {
    setLoading(true);
    const authToken = token || localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setResult({ type: 'dashboard', status: response.status, data });
    } catch (error) {
      setResult({ type: 'dashboard', error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Admin API Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : '1. Test Login'}
          </button>
          
          <button
            onClick={() => testDashboard()}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 mr-4"
          >
            {loading ? 'Testing...' : '2. Test Dashboard'}
          </button>
          
          <button
            onClick={clearStorage}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 mr-4"
          >
            Clear Storage
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Test Result: {result.type} 
              {result.status && (
                <span className={`ml-2 ${result.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                  ({result.status})
                </span>
              )}
            </h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Click "Test Login" first - should return token and user data</li>
            <li>Then "Test Dashboard" - should return admin statistics</li>
            <li>Check the console for detailed logs</li>
            <li>If both work, go to <a href="/admin" className="text-blue-600 underline">/admin</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
