'use client';

import { useState } from 'react';
import { ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Mock data for charts
const dailyRequests = [
  { date: '2023-03-16', count: 156, piiDetected: 42, blocked: 3 },
  { date: '2023-03-17', count: 142, piiDetected: 38, blocked: 5 },
  { date: '2023-03-18', count: 98, piiDetected: 21, blocked: 2 },
  { date: '2023-03-19', count: 112, piiDetected: 29, blocked: 4 },
  { date: '2023-03-20', count: 165, piiDetected: 45, blocked: 7 },
  { date: '2023-03-21', count: 187, piiDetected: 52, blocked: 8 },
  { date: '2023-03-22', count: 201, piiDetected: 61, blocked: 9 },
];

const modelUsage = [
  { model: 'gpt-3.5-turbo', count: 623, percentage: 58 },
  { model: 'gpt-4', count: 215, percentage: 20 },
  { model: 'claude-instant', count: 124, percentage: 12 },
  { model: 'claude-2', count: 86, percentage: 8 },
  { model: 'command', count: 23, percentage: 2 },
];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('7d');
  
  // Highest point in the data to scale chart correctly
  const maxRequestCount = Math.max(...dailyRequests.map(day => day.count));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Timeframe:</span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>
      
      {/* Requests overview chart */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Requests Overview</h2>
          <div className="mt-4" style={{ height: '300px' }}>
            <div className="flex h-full items-end">
              {dailyRequests.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex flex-col items-center">
                    {/* PII detected bar */}
                    <div 
                      className="w-12 bg-yellow-400 rounded-t" 
                      style={{ 
                        height: `${(day.piiDetected / maxRequestCount) * 200}px`,
                        zIndex: 20 
                      }}
                    ></div>
                    
                    {/* Blocked requests bar (positioned on top of PII bar) */}
                    <div 
                      className="w-12 bg-red-500 rounded-t absolute bottom-0" 
                      style={{ 
                        height: `${(day.blocked / maxRequestCount) * 200}px`,
                        zIndex: 30 
                      }}
                    ></div>
                    
                    {/* Total requests bar (positioned at the bottom) */}
                    <div 
                      className="w-12 bg-indigo-500 rounded-t absolute bottom-0" 
                      style={{ 
                        height: `${(day.count / maxRequestCount) * 200}px`,
                        zIndex: 10 
                      }}
                    ></div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Total Requests</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">PII Detected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Blocked Requests</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Model Usage */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Model Usage</h2>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              {modelUsage.map((model, index) => (
                <div 
                  key={model.model}
                  className={`h-full float-left ${
                    index === 0 ? 'bg-indigo-600' :
                    index === 1 ? 'bg-indigo-500' :
                    index === 2 ? 'bg-indigo-400' :
                    index === 3 ? 'bg-indigo-300' : 'bg-indigo-200'
                  }`}
                  style={{ width: `${model.percentage}%` }}
                  title={`${model.model}: ${model.count} requests (${model.percentage}%)`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            {modelUsage.map((model, index) => (
              <div key={model.model} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    index === 0 ? 'bg-indigo-600' :
                    index === 1 ? 'bg-indigo-500' :
                    index === 2 ? 'bg-indigo-400' :
                    index === 3 ? 'bg-indigo-300' : 'bg-indigo-200'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{model.model}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{model.count} requests</span>
                  <span className="text-sm font-medium text-gray-900">{model.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* PII Detection Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Common PII Types</h2>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email Addresses</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">76%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Phone Numbers</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">53%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Credit Card Numbers</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">24%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Addresses</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">42%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Names</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">35%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Redaction Metrics</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Average PII per Request</h3>
                <p className="mt-1 text-3xl font-semibold text-indigo-600">2.4</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Redaction Success Rate</h3>
                <p className="mt-1 text-3xl font-semibold text-green-600">99.7%</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">False Positive Rate</h3>
                <p className="mt-1 text-3xl font-semibold text-yellow-600">1.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 