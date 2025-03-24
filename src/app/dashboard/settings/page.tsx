'use client';

import { useState } from 'react';
import { CogIcon, UserIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  company: 'Example Corp',
  plan: 'Premium',
  preferences: {
    emailNotifications: true,
    slackNotifications: false,
    twoFactorAuth: true,
    darkMode: false
  }
};

export default function Settings() {
  const [user, setUser] = useState(userData);
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleToggle = (key: keyof typeof user.preferences) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [key]: !user.preferences[key]
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <CogIcon className="h-6 w-6 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab navigation */}
        <div className="w-full sm:w-64 flex-shrink-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <nav className="space-y-1" aria-label="Tabs">
                <a
                  href="#profile"
                  onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'profile' 
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <UserIcon className="h-5 w-5 mr-3" />
                  <span>Profile</span>
                </a>
                
                <a
                  href="#notifications"
                  onClick={(e) => { e.preventDefault(); setActiveTab('notifications'); }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'notifications' 
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BellIcon className="h-5 w-5 mr-3" />
                  <span>Notifications</span>
                </a>
                
                <a
                  href="#security"
                  onClick={(e) => { e.preventDefault(); setActiveTab('security'); }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'security' 
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-3" />
                  <span>Security</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="flex-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {activeTab === 'profile' && (
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={user.company}
                      onChange={(e) => setUser({ ...user, company: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('emailNotifications')}
                      className={`${
                        user.preferences.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          user.preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Slack Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications in your Slack workspace</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('slackNotifications')}
                      className={`${
                        user.preferences.slackNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          user.preferences.slackNotifications ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Configure detailed notification settings
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('twoFactorAuth')}
                      className={`${
                        user.preferences.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          user.preferences.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="current-password"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirm-password"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-red-500">Danger Zone</h3>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 