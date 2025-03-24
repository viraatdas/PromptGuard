'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  ShieldCheckIcon, 
  ExclamationCircleIcon, 
  UsersIcon,
  KeyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [totalRequests, setTotalRequests] = useState(1284);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample statistics data
  const stats = [
    {
      name: 'Total Requests',
      value: '1,284',
      change: '+12.5%',
      changeType: 'increase',
      icon: ChartBarIcon,
    },
    {
      name: 'PII Detected',
      value: '342',
      change: '+18.3%',
      changeType: 'increase',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Blocked Requests',
      value: '24',
      change: '-4.1%',
      changeType: 'decrease',
      icon: ExclamationCircleIcon,
    },
    {
      name: 'Active Users',
      value: '38',
      change: '+7.2%',
      changeType: 'increase',
      icon: UsersIcon,
    },
    {
      name: 'Active API Keys',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: KeyIcon,
    },
  ];

  // Sample recent requests
  const recentRequests = [
    {
      id: 'req_5fb3e12a',
      model: 'gpt-4',
      status: 'completed',
      piiDetected: true,
      timestamp: '2 minutes ago',
    },
    {
      id: 'req_8ac4f219',
      model: 'claude-2',
      status: 'completed',
      piiDetected: false,
      timestamp: '15 minutes ago',
    },
    {
      id: 'req_3d7e9b06',
      model: 'gpt-3.5-turbo',
      status: 'blocked',
      piiDetected: true,
      timestamp: '32 minutes ago',
    },
    {
      id: 'req_1f5c8a93',
      model: 'command',
      status: 'completed',
      piiDetected: false,
      timestamp: '1 hour ago',
    },
    {
      id: 'req_7b2d4e85',
      model: 'gpt-4',
      status: 'completed',
      piiDetected: true,
      timestamp: '2 hours ago',
    },
  ];

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link 
          href="/dashboard/playground" 
          className="btn btn-primary"
        >
          Try Playground
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card card-hover">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
              <div className="text-sm">
                <span
                  className={`inline-flex items-center ${
                    stat.changeType === 'increase'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {stat.change} from last week
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Usage */}
      <div className="card mb-8">
        <div className="card-header border-b">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Subscription Usage</h2>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Requests: 1,284 / 5,000
              </div>
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                25%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Storage: 2.4 GB / 10 GB
              </div>
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                24%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Premium plan - Renews on November 15, 2023
            </div>
            <Link 
              href="/dashboard/billing"
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
              Manage Subscription →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="card-header border-b">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Request ID</th>
                <th scope="col">Model</th>
                <th scope="col">Status</th>
                <th scope="col">PII</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="text-gray-900 dark:text-gray-100 font-mono">
                    <Link 
                      href={`/dashboard/requests/${request.id}`}
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {request.id}
                    </Link>
                  </td>
                  <td className="text-gray-500 dark:text-gray-400">{request.model}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : request.status === 'blocked'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {request.status === 'completed' ? (
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                      ) : request.status === 'blocked' ? (
                        <NoSymbolIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ClockIcon className="h-4 w-4 mr-1" />
                      )}
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.piiDetected ? (
                      <span className="inline-flex items-center text-amber-600 dark:text-amber-400">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
                        Detected
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                        None
                      </span>
                    )}
                  </td>
                  <td className="text-gray-500 dark:text-gray-400">{request.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link 
            href="/dashboard/requests" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all requests →
          </Link>
        </div>
      </div>
    </div>
  );
} 