'use client';

import { useState } from 'react';

interface DbInfo {
  success: boolean;
  database?: {
    connected: boolean;
    totalUsers?: number;
    adminUsers?: number;
  };
  admins?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    hasPassword: boolean;
  }>;
  error?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  debug?: {
    email: string;
    userExists: boolean;
    hasPassword?: boolean;
    passwordValid?: boolean;
    role?: string;
  };
}

export default function DebugAuthPage() {
  const [email, setEmail] = useState('admin@goodpractices.vn');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState<AuthResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbInfo, setDbInfo] = useState<DbInfo | null>(null);

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/debug/auth');
      const data = await response.json();
      setDbInfo(data);
    } catch (error) {
      setDbInfo({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const setupAdmin = async () => {
    try {
      const response = await fetch('/api/setup/admin', { method: 'POST' });
      const data = await response.json();
      setDbInfo(data);
      // Refresh database info after setup
      setTimeout(checkDatabase, 1000);
    } catch (error) {
      setDbInfo({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Authentication Debug Tool</h1>

          {/* Database Info */}
          <div className="mb-8">
            <div className="space-x-2">
              <button
                onClick={checkDatabase}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Check Database Connection
              </button>
              <button
                onClick={setupAdmin}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Setup Admin Users
              </button>
            </div>

            {dbInfo && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Database Status:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(dbInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Auth Test */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={testAuth}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Authentication'}
            </button>

            {result && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Authentication Result:</h3>
                <div className={`p-4 rounded ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                  <div className="font-semibold mb-2">
                    {result.success ? '✅ Success' : '❌ Failed'}
                  </div>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Quick Test Buttons */}
          <div className="mt-8 space-y-2">
            <h3 className="font-semibold">Quick Tests:</h3>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEmail('admin@goodpractices.vn');
                  setPassword('admin123');
                }}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                New Admin Account
              </button>
              <button
                onClick={() => {
                  setEmail('an.nguyen@example.com');
                  setPassword('admin123');
                }}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Original Admin Account
              </button>
              <button
                onClick={() => {
                  setEmail('an.nguyen@example.com');
                  setPassword('password123');
                }}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Original Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}