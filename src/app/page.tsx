'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 relative">
                <Image 
                  src="/logo.svg" 
                  alt="PromptGuard Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PromptGuard</span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link href="#features" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Features
              </Link>
              <Link href="#pricing" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Pricing
              </Link>
              <Link href="#faq" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                FAQ
              </Link>
              <Link href="/docs" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Docs
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="btn btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-gray-900"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Secure Your AI</span>
                  <span className="block text-indigo-600 dark:text-indigo-400">Protect Your Data</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                  PromptGuard helps you secure your AI interactions by detecting and redacting sensitive information. Prevent data leaks and ensure compliance while using AI models.
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link 
                      href="/signup" 
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started Free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link 
                      href="#features" 
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] w-full bg-indigo-600 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-800 dark:to-indigo-950">
                    <div className="text-center p-5 glass rounded-lg max-w-md mx-auto">
                      <div className="flex justify-center mb-4">
                        <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Your Data is Safe</h2>
                      <p className="text-indigo-100 mb-6">PromptGuard ensures your sensitive information never leaves your control.</p>
                      
                      <div className="mt-6 border border-indigo-300/30 rounded-lg p-4 bg-white/10 backdrop-blur-sm">
                        <div className="text-sm font-mono text-left text-indigo-100">
                          <p><span className="text-red-300">Redacted:</span> "My credit card number is <span className="bg-red-500/40 px-1 rounded">••••-••••-••••-1234</span>"</p>
                          <p className="mt-2"><span className="text-red-300">Redacted:</span> "My email is <span className="bg-red-500/40 px-1 rounded">••••@example.com</span>"</p>
                          <p className="mt-2"><span className="text-red-300">Redacted:</span> "Call me at <span className="bg-red-500/40 px-1 rounded">•••-•••-5678</span>"</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-2 text-white">PII Detection</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-2 text-white">Prompt Injection Defense</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-2 text-white">Multi-Provider Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Comprehensive AI Security
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Powerful tools to protect your data across all AI interactions.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="card card-hover p-6">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900 dark:text-white">PII Detection & Redaction</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Automatically identify and redact sensitive personal information before it reaches AI models.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card card-hover p-6">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900 dark:text-white">Prompt Injection Defense</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Protect against malicious prompts that attempt to manipulate or bypass AI guardrails.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card card-hover p-6">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900 dark:text-white">Multi-Provider Support</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Seamlessly integrate with OpenAI, Anthropic, Cohere, and other leading AI providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 dark:bg-indigo-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to secure your AI?</span>
            <span className="block text-indigo-200">Start protecting your data today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <div className="h-8 w-8 relative">
                  <Image 
                    src="/logo.svg" 
                    alt="PromptGuard Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PromptGuard</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Securing AI interactions with advanced protection for your sensitive data.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href="#features" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link href="#pricing" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="/changelog" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Changelog
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href="/faq" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/status" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Status
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href="/about" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/careers" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Terms
                      </Link>
                    </li>
                    <li>
                      <Link href="/security" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        Security
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} PromptGuard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 