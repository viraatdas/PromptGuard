'use client';

import { useState } from 'react';
import { KeyIcon, ClipboardIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// Mock API keys
const initialApiKeys = [
  { id: 'key_1a2b3c4d', name: 'Production API Key', created: '2023-02-15', lastUsed: '2023-03-22', active: true },
  { id: 'key_5e6f7g8h', name: 'Development API Key', created: '2023-02-20', lastUsed: '2023-03-21', active: true },
  { id: 'key_9i10j11k', name: 'Testing API Key', created: '2023-03-01', lastUsed: '2023-03-15', active: false },
];

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newKeyGenerated, setNewKeyGenerated] = useState<{id: string, value: string} | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    
    // Generate a mock API key
    const newKeyId = `key_${Math.random().toString(36).substring(2, 10)}`;
    const newKeyValue = `pk_live_${Math.random().toString(36).substring(2, 30)}`;
    
    const newKey = {
      id: newKeyId,
      name: newKeyName,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      active: true
    };
    
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setShowNewKeyForm(false);
    setNewKeyGenerated({id: newKeyId, value: newKeyValue});
  };
  
  const handleDeactivateKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId 
        ? { ...key, active: false } 
        : key
    ));
  };
  
  const handleCopyKey = (keyValue: string) => {
    // In a real app, we would use clipboard API
    // For this mock, we'll just simulate copying
    setCopiedKey(keyValue);
    setTimeout(() => setCopiedKey(null), 2000);
  };
  
  const handleDismissNewKey = () => {
    setNewKeyGenerated(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <KeyIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
        </div>
        
        <button
          type="button"
          onClick={() => setShowNewKeyForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create New API Key
        </button>
      </div>
      
      {/* New API Key form */}
      {showNewKeyForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New API Key</h2>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="key-name" className="block text-sm font-medium text-gray-700">
                Key Name
              </label>
              <input
                type="text"
                id="key-name"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g. Production API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCreateKey}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNewKeyForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Newly generated key alert */}
      {newKeyGenerated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">API Key Created</h3>
              <p className="mt-1 text-sm text-green-700">
                Please copy your API key now. You won't be able to see it again.
              </p>
              <div className="mt-2 bg-white p-2 rounded border border-green-300 flex items-center">
                <code className="text-sm text-gray-800 flex-1 font-mono">{newKeyGenerated.value}</code>
                <button
                  type="button"
                  onClick={() => handleCopyKey(newKeyGenerated.value)}
                  className="ml-2 p-1 text-green-700 hover:text-green-900"
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismissNewKey}
              className="ml-4 p-1 text-green-700 hover:text-green-900"
            >
              <span className="sr-only">Dismiss</span>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      )}
      
      {/* API Keys List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Used
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {key.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{key.id.replace('key_', '•••••••••')}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {key.created}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {key.lastUsed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${key.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {key.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {key.active ? (
                    <button
                      onClick={() => handleDeactivateKey(key.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      <TrashIcon className="h-5 w-5" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Usage Guidelines */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">API Usage Guidelines</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              To use your API key, include it in the Authorization header of your requests:
            </p>
            <pre className="mt-2 bg-gray-50 p-3 rounded text-xs font-mono">
              Authorization: Bearer YOUR_API_KEY
            </pre>
            <p className="mt-3">
              For security, do not share your API key or expose it in client-side code.
              Rotate your keys regularly and use different keys for production and development.
            </p>
          </div>
          <div className="mt-5">
            <a
              href="/docs/api"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View API Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 