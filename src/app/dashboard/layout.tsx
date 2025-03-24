'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  BeakerIcon,
  ChartBarIcon,
  KeyIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Playground', href: '/dashboard/playground', icon: BeakerIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon },
  { name: 'Security', href: '/dashboard/security', icon: ShieldCheckIcon },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCardIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  
  useEffect(() => {
    // Set current path based on window location
    setCurrentPath(window.location.pathname);
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Listen for changes to URL
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-slate-900">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="h-8 w-auto relative">
                    <Image
                      src="/logo.svg"
                      alt="PromptGuard"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PromptGuard</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        ${currentPath === item.href
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                        }
                        group flex items-center px-2 py-2 text-base font-medium rounded-md
                      `}
                      onClick={() => {
                        setCurrentPath(item.href);
                        setSidebarOpen(false);
                      }}
                    >
                      <item.icon
                        className={`
                          ${currentPath === item.href
                            ? 'text-indigo-600 dark:text-indigo-300'
                            : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                          }
                          mr-4 flex-shrink-0 h-6 w-6
                        `}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700">
                      <svg className="h-full w-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 dark:text-gray-200">John Doe</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        Premium Plan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="h-8 w-auto relative">
                  <Image
                    src="/logo.svg"
                    alt="PromptGuard"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PromptGuard</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      ${currentPath === item.href
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                      }
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    `}
                    onClick={() => setCurrentPath(item.href)}
                  >
                    <item.icon
                      className={`
                        ${currentPath === item.href
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }
                        mr-3 flex-shrink-0 h-6 w-6
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <svg className="h-full w-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">John Doe</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Premium Plan
                    </p>
                  </div>
                  <button
                    onClick={() => toggleDarkMode()}
                    className="ml-auto flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {isDarkMode ? (
                      <SunIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <MoonIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                    <span className="sr-only">Toggle dark mode</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex-1 flex justify-between items-center">
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => toggleDarkMode()}
                className="flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-5 w-5" aria-hidden="true" />
                )}
                <span className="sr-only">Toggle dark mode</span>
              </button>
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 