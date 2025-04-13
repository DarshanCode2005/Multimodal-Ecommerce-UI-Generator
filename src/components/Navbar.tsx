'use client';

import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';

type NavbarProps = {
  onToggleLeftPane: () => void;
  onToggleRightPane: () => void;
  isLeftPaneVisible: boolean;
  isRightPaneVisible: boolean;
};

export default function Navbar({ 
  onToggleLeftPane, 
  onToggleRightPane, 
  isLeftPaneVisible, 
  isRightPaneVisible 
}: NavbarProps) {
  const { useMultimodalInput, toggleMultimodalInput } = useEditorStore();

  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white p-4 h-16">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleLeftPane}
          className="p-2 rounded hover:bg-gray-700"
          title={isLeftPaneVisible ? "Hide pages panel" : "Show pages panel"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isLeftPaneVisible ? (
              <path d="M13 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H13M13 5V19M13 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H13" />
            ) : (
              <path d="M11 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H11M11 5V19M11 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H11" />
            )}
          </svg>
        </button>
        <div className="text-xl font-bold">Website Builder</div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMultimodalInput}
          className={`px-3 py-1.5 rounded text-sm font-medium ${
            useMultimodalInput ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title={useMultimodalInput ? "Switch to standard AI input" : "Switch to multimodal AI input"}
        >
          {useMultimodalInput ? 'Multimodal Input ✨' : 'Standard Input'}
        </button>
        
        <button
          onClick={onToggleRightPane}
          className="p-2 rounded hover:bg-gray-700"
          title={isRightPaneVisible ? "Hide code editor" : "Show code editor"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isRightPaneVisible ? (
              <path d="M11 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H11M11 5V19M11 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H11" />
            ) : (
              <path d="M13 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H13M13 5V19M13 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H13" />
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
} 