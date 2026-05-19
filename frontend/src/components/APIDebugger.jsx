
import React, { useState } from 'react';

const APIDebugger = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
   
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setResult({ success: true, data });
      console.log('API Test Result:', data);
    } catch (error) {
      setResult({ success: false, error: error.message });
      console.error('API Test Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      {result && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-lg max-w-md">
          {result.success ? (
            <div>
              <p className="text-green-600 font-semibold">✅ API Connected!</p>
              <p className="text-sm mt-1">Products found: {result.data.length || result.data.products?.length || 0}</p>
              <pre className="text-xs mt-2 overflow-auto max-h-40">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p className="text-red-600 font-semibold">❌ API Error</p>
              <p className="text-sm">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APIDebugger;