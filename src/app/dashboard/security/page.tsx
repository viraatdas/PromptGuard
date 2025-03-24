'use client';

import { useState } from 'react';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Mock security audit logs
const auditLogs = [
  { id: 1, event: 'Login successful', ip: '192.168.1.1', location: 'San Francisco, US', timestamp: '2023-03-22 14:32:41', user: 'john.doe@example.com' },
  { id: 2, event: 'API key created', ip: '192.168.1.1', location: 'San Francisco, US', timestamp: '2023-03-21 10:15:22', user: 'john.doe@example.com' },
  { id: 3, event: 'Password changed', ip: '192.168.1.1', location: 'San Francisco, US', timestamp: '2023-03-15 09:45:17', user: 'john.doe@example.com' },
  { id: 4, event: 'Failed login attempt', ip: '103.42.95.18', location: 'Beijing, CN', timestamp: '2023-03-14 22:11:08', user: 'john.doe@example.com' },
  { id: 5, event: 'API key revoked', ip: '192.168.1.1', location: 'San Francisco, US', timestamp: '2023-03-10 16:30:45', user: 'john.doe@example.com' },
];

// Mock IP addresses for whitelist
const initialIpWhitelist = [
  { id: 1, ip: '192.168.1.1', description: 'Office IP' },
  { id: 2, ip: '10.0.0.1', description: 'Home network' },
];

export default function Security() {
  const [ipWhitelist, setIpWhitelist] = useState(initialIpWhitelist);
  const [newIp, setNewIp] = useState('');
  const [newIpDescription, setNewIpDescription] = useState('');
  
  const handleAddIp = () => {
    if (!newIp) return;
    
    const newEntry = {
      id: ipWhitelist.length + 1,
      ip: newIp,
      description: newIpDescription || 'No description'
    };
    
    setIpWhitelist([...ipWhitelist, newEntry]);
    setNewIp('');
    setNewIpDescription('');
  };
  
  const handleRemoveIp = (id: number) => {
    setIpWhitelist(ipWhitelist.filter(ip => ip.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <ShieldCheckIcon className="h-6 w-6 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-semibold text-gray-900">Security</h1>
      </div>
      
      {/* Security Recommendations */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <LockClosedIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Security Recommendation:</strong> Enable two-factor authentication for additional account security.
              <a href="/dashboard/settings" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                Update in settings
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Security Audit Logs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">Security Audit Logs</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review recent security events for your account.</p>
          </div>
          <div>
            <button 
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export Logs
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* IP Whitelist */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">IP Address Whitelist</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Restrict API access to specific IP addresses for enhanced security.
              When IP whitelisting is enabled, requests from non-whitelisted IPs will be rejected.
            </p>
          </div>
          
          <div className="mt-4 sm:flex sm:items-end">
            <div className="sm:flex-grow sm:mr-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="ip-address" className="block text-sm font-medium text-gray-700">
                    IP Address
                  </label>
                  <input
                    type="text"
                    name="ip-address"
                    id="ip-address"
                    placeholder="192.168.1.1"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Office IP"
                    value={newIpDescription}
                    onChange={(e) => setNewIpDescription(e.target.value)}
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddIp}
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Add IP
            </button>
          </div>
          
          <div className="mt-5">
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ipWhitelist.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveIp(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ipWhitelist.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        No IP addresses in whitelist
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-5 flex items-center">
            <input
              id="enable-whitelist"
              name="enable-whitelist"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="enable-whitelist" className="ml-2 block text-sm text-gray-900">
              Enable IP Whitelist Restriction
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            When enabled, API requests will only be accepted from the IP addresses listed above.
          </p>
        </div>
      </div>
    </div>
  );
} 