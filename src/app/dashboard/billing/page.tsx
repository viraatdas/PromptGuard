'use client';

import { useState } from 'react';
import { CreditCardIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Mock pricing plans
const plans = [
  { id: 'free', name: 'Free', price: '$0', requests: '1,000', features: ['Basic PII detection', 'Limited models', 'Standard support'] },
  { id: 'basic', name: 'Basic', price: '$49', requests: '10,000', features: ['Advanced PII detection', 'Most popular models', 'Email support'] },
  { id: 'premium', name: 'Premium', price: '$99', requests: '50,000', features: ['Custom PII detection rules', 'All models', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Contact us', requests: 'Unlimited', features: ['Custom implementation', 'SLA guarantees', 'Dedicated support'] },
];

// Mock payment methods
const paymentMethods = [
  { id: 1, type: 'Credit Card', last4: '4242', expiryMonth: 12, expiryYear: 2025, isDefault: true },
  { id: 2, type: 'Credit Card', last4: '5555', expiryMonth: 3, expiryYear: 2024, isDefault: false },
];

// Mock invoices
const invoices = [
  { id: 'INV-001', date: '2023-03-01', amount: '$99.00', status: 'Paid' },
  { id: 'INV-002', date: '2023-02-01', amount: '$99.00', status: 'Paid' },
  { id: 'INV-003', date: '2023-01-01', amount: '$99.00', status: 'Paid' },
];

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [showAddPayment, setShowAddPayment] = useState(false);
  
  const handleSetDefaultPayment = (id: number) => {
    // In a real app, this would update the default payment method
    console.log(`Setting payment method ${id} as default`);
  };
  
  const handleChangePlan = (planId: string) => {
    // In a real app, this would trigger a subscription change
    setCurrentPlan(planId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <CreditCardIcon className="h-6 w-6 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
      </div>
      
      {/* Current Subscription */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Current Subscription</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details about your current plan and usage.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Premium Plan</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>$99 per month</p>
                <p className="mt-1">Renews on April 1, 2023</p>
              </div>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage Subscription
              </button>
            </div>
          </div>
          
          {/* Usage progress bar */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900">API Usage (This Month)</h4>
            <div className="mt-2 flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-5 rounded-full"
                  style={{ width: '36%' }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                18,256 / 50,000 requests (36%)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">Payment Methods</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your payment methods.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddPayment(!showAddPayment)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Payment Method
          </button>
        </div>
        
        {/* Add payment method form */}
        {showAddPayment && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  name="card-number"
                  id="card-number"
                  placeholder="•••• •••• •••• ••••"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
                  Name on Card
                </label>
                <input
                  type="text"
                  name="card-name"
                  id="card-name"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry-date"
                  id="expiry-date"
                  placeholder="MM / YY"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  name="cvc"
                  id="cvc"
                  placeholder="•••"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="col-span-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {paymentMethods.map((method) => (
              <li key={method.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {method.type} ending in {method.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {method.isDefault ? (
                      <span className="text-sm text-indigo-600 font-medium flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultPayment(method.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Make Default
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Invoices */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Billing History</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your past invoices and payment history.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Available Plans */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Available Plans</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Compare plans and upgrade or downgrade your subscription.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`border rounded-lg overflow-hidden ${
                  currentPlan === plan.id 
                    ? 'border-indigo-500 ring-2 ring-indigo-500' 
                    : 'border-gray-300'
                }`}
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-2xl font-extrabold text-gray-900">{plan.price}</span>
                    {plan.id !== 'enterprise' && <span className="ml-1 text-sm text-gray-500">/month</span>}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {plan.requests} requests per month
                  </p>
                  
                  <ul role="list" className="mt-4 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        </div>
                        <p className="ml-2 text-sm text-gray-500">{feature}</p>
                      </li>
                    ))}
                  </ul>
                  
                  {currentPlan === plan.id ? (
                    <div className="mt-6">
                      <span className="block w-full rounded-md bg-indigo-100 py-2 text-sm font-medium text-indigo-700 text-center">
                        Current Plan
                      </span>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => handleChangePlan(plan.id)}
                        className="block w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white text-center hover:bg-indigo-700"
                      >
                        {plan.id === 'enterprise' ? 'Contact Sales' : 'Switch to Plan'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 