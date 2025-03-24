'use client';

import { useState } from 'react';

export default function Playground() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState('gpt-3.5-turbo');
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);

  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'claude-2', name: 'Claude 2', provider: 'Anthropic' },
    { id: 'claude-instant', name: 'Claude Instant', provider: 'Anthropic' },
    { id: 'command', name: 'Command', provider: 'Cohere' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    setDetectedIssues([]);
    
    try {
      // In a real application, this would be an API call to your PromptGuard backend
      // const response = await fetch('/api/proxy/completion', {...})
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate PII detection
      const mockDetectedIssues = [];
      if (prompt.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)) {
        mockDetectedIssues.push('Phone number detected and redacted');
      }
      if (prompt.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)) {
        mockDetectedIssues.push('Email address detected and redacted');
      }
      if (prompt.toLowerCase().includes('password') || prompt.toLowerCase().includes('credit card')) {
        mockDetectedIssues.push('Sensitive information keywords detected');
      }
      
      setDetectedIssues(mockDetectedIssues);
      
      // Simulate response
      setResponse(`This is a simulated response from ${activeModel}. In a real implementation, this would be the actual AI response with any sensitive information redacted.\n\nYour prompt was analyzed for security issues before being sent to the AI model.`);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI Playground</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Test your prompts with PII detection and prompt injection security enabled.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card overflow-visible">
            <div className="card-header border-b">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Send a Prompt</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="card-body">
              <div className="mb-4">
                <label htmlFor="model" className="form-label">Select Model</label>
                <select
                  id="model"
                  className="form-select"
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value)}
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="prompt" className="form-label">Your Prompt</label>
                <textarea
                  id="prompt"
                  rows={6}
                  className="form-input"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try including some PII (like "my email is test@example.com") to see how PromptGuard protects your data.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {response && (
            <div className="card mt-6">
              <div className="card-header border-b">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">AI Response</h2>
              </div>
              <div className="card-body">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">{response}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header border-b">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security Insights</h2>
            </div>
            <div className="card-body">
              {detectedIssues.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Detected Issues:</h3>
                  <ul className="space-y-2">
                    {detectedIssues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{issue}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      PromptGuard detected and mitigated security issues in your prompt. The AI will only receive a sanitized version.
                    </p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <svg className="animate-spin mx-auto h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Analyzing prompt security...</p>
                </div>
              ) : response ? (
                <div className="text-center py-8">
                  <span className="flex-shrink-0 mx-auto h-12 w-12 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No security issues detected in your prompt.</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submit a prompt to see security analysis results here.
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">About PromptGuard Security</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  PromptGuard protects your data by:
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-4 w-4 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Detecting and redacting PII</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-4 w-4 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Preventing prompt injection attacks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-4 w-4 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Logging all access for compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 