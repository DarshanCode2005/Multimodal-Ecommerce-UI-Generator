'use client';

import { useState } from 'react';
import PageRenderer from './PageRenderer';

type PreviewPaneProps = {
  expanded: boolean;
};

export default function PreviewPane({ expanded }: PreviewPaneProps) {
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showHelp, setShowHelp] = useState(true);
  
  const getViewportClass = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className={`flex-1 h-full flex flex-col overflow-hidden`}>
      <div className="flex items-center justify-between bg-gray-800 text-white p-2 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewportSize('mobile')}
            className={`px-3 py-1 rounded text-sm ${viewportSize === 'mobile' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Mobile
          </button>
          <button
            onClick={() => setViewportSize('tablet')}
            className={`px-3 py-1 rounded text-sm ${viewportSize === 'tablet' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Tablet
          </button>
          <button
            onClick={() => setViewportSize('desktop')}
            className={`px-3 py-1 rounded text-sm ${viewportSize === 'desktop' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Desktop
          </button>
        </div>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-gray-300 hover:text-white px-3 py-1 rounded text-sm"
        >
          {showHelp ? 'Hide Help' : 'Show Help'}
        </button>
      </div>
      
      {showHelp && (
        <div className="bg-blue-50 border-b border-blue-200 p-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How to edit components</h3>
              <div className="mt-1 text-xs text-blue-700">
                <p>1. Hover over any element in the preview to highlight it</p>
                <p>2. Click on an element to select it and open the AI editor</p>
                <p>3. Describe the changes you want to make in natural language</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 bg-gray-200 overflow-auto p-4 flex justify-center">
        <div className={`${getViewportClass()} h-full bg-white rounded shadow-lg overflow-hidden transition-all duration-300`}>
          <PageRenderer expanded={expanded} />
        </div>
      </div>
    </div>
  );
} 