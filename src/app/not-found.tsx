'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-4 mb-6">
            <div className="rounded-full stroke-indigo-600 dark:stroke-indigo-400 bg-indigo-200 dark:bg-indigo-900/50 p-4">
              <svg className="w-16 h-16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 5C8.48 5 4 9.48 4 15C4 20.52 8.48 25 14 25C19.52 25 24 20.52 24 15C24 9.48 19.52 5 14 5ZM15 19H13V17H15V19ZM15 15H13V11H15V15Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          
          <h1 className="mt-5 text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Page not found</h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Sorry, we couldn't find the page you're looking for.</p>
          
          <div className="mt-10">
            <Link 
              href="/"
              className="btn btn-primary"
            >
              Go back home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 