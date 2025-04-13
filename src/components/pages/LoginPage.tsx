'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useFileStore } from '../../store/fileStore';
import { componentToFileMap } from '../../services/componentSyncService';
import SelectableElement from '../SelectableElement';
import { renderJSXString } from '../../utils/jsxRenderer';

export default function LoginPage() {
  const { selectedElement, setSelectedElement, openAIModal, lastModifiedElement } = useEditorStore();
  const { activeFileId, getFileContent } = useFileStore();
  const [dynamicContent, setDynamicContent] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Handler for element selection
  const handleElementSelect = (element: { type: string; ref: HTMLElement; code: string }) => {
    setSelectedElement(element);
    openAIModal();
  };

  // Effect to handle element modifications from AI
  useEffect(() => {
    if (lastModifiedElement) {
      try {
        // Store the modified code string
        setDynamicContent(prev => ({
          ...prev,
          [lastModifiedElement.type]: lastModifiedElement.modifiedCode
        }));
      } catch (error) {
        console.error('Error applying modified code:', error);
      }
    }
  }, [lastModifiedElement]);

  // Effect to handle file changes from the editor
  useEffect(() => {
    if (activeFileId) {
      // Find which components correspond to this file
      const matchingComponents = Object.entries(componentToFileMap)
        .filter(([_, fileId]) => fileId === activeFileId)
        .map(([componentType]) => componentType);

      if (matchingComponents.length > 0) {
        // Get the file content
        const fileContent = getFileContent(activeFileId);
        
        // Update all matching components
        matchingComponents.forEach(componentType => {
          try {
            setDynamicContent(prev => ({
              ...prev,
              [componentType]: fileContent
            }));
          } catch (error) {
            console.error(`Error updating ${componentType} from file:`, error);
          }
        });
      }
    }
  }, [activeFileId, getFileContent]);

  // Render an element with potential dynamic content
  const renderElement = (type: string, originalContent: React.ReactNode) => {
    // If this element has modified content, render the JSX string directly
    if (dynamicContent[type]) {
      // Use our utility to render the JSX string
      return renderJSXString(dynamicContent[type], originalContent);
    }
    // Otherwise render the original content
    return originalContent;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SelectableElement 
        elementType="AuthHeader" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'AuthHeader'}
      >
        {renderElement("AuthHeader", (
          <header className="bg-white shadow-sm py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-600">YourBrand</h1>
              <div className="text-sm">
                Need help? <a href="#" className="text-blue-600 hover:underline">Contact support</a>
              </div>
            </div>
          </header>
        ))}
      </SelectableElement>
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <SelectableElement 
          elementType="AuthForm" 
          onSelect={handleElementSelect}
          isSelected={selectedElement?.type === 'AuthForm'}
          className="w-full max-w-md"
        >
          {renderElement("AuthForm", (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 font-medium ${activeTab === 'login' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500'}`}
                  onClick={() => setActiveTab('login')}
                >
                  Log In
                </button>
                <button
                  className={`flex-1 py-3 font-medium ${activeTab === 'signup' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500'}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  {activeTab === 'login' ? 'Welcome back!' : 'Create your account'}
                </h2>

                {/* Form */}
                <form className="space-y-4">
                  {activeTab === 'signup' && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={activeTab === 'login' ? 'Enter your password' : 'Create a password'}
                    />
                  </div>

                  {activeTab === 'signup' && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}

                  {activeTab === 'login' && (
                    <div className="flex justify-end">
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    {activeTab === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    >
                      <svg className="h-5 w-5 mr-2" fill="#4285F4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    >
                      <svg className="h-5 w-5 mr-2" fill="#1877F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path d="M24 5C13.5 5 5 13.5 5 24c0 8.9 6.2 16.4 14.5 18.4V28.9h-4.4V24h4.4v-3.8c0-4.3 2.6-6.7 6.5-6.7 1.9 0 3.8 0.3 3.8 0.3v4.2h-2.2c-2.1 0-2.8 1.3-2.8 2.7V24h4.7l-0.8 4.9h-4V42.5C36.8 40.5 43 33 43 24 43 13.5 34.5 5 24 5z" />
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                  {activeTab === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button 
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => setActiveTab('signup')}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => setActiveTab('login')}
                      >
                        Log in
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </SelectableElement>
      </main>
      
      <SelectableElement 
        elementType="AuthFooter" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'AuthFooter'}
      >
        {renderElement("AuthFooter", (
          <footer className="bg-white py-4 border-t">
            <div className="container mx-auto px-6 text-center text-sm text-gray-600">
              <p>© 2023 YourBrand, Inc. All rights reserved.</p>
              <div className="mt-2 flex justify-center space-x-4">
                <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900">Terms of Service</a>
                <a href="#" className="hover:text-gray-900">Contact Us</a>
              </div>
            </div>
          </footer>
        ))}
      </SelectableElement>
    </div>
  );
} 