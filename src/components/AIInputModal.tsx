'use client';

import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import { updateComponentFromPreview } from '../services/componentSyncService';
import { modifyElementWithAI } from '../services/geminiService';
import { usePageStore } from '../store/pageStore';

export default function AIInputModal() {
  const { 
    selectedElement, 
    isAIModalOpen, 
    closeAIModal, 
    isProcessing,
    startProcessing,
    stopProcessing,
    setLastModifiedElement
  } = useEditorStore();
  
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !selectedElement?.code) return;
    
    setError(null);
    startProcessing();
    
    try {
      // Get the code from the selected element
      const originalCode = selectedElement.code;
      
      console.log('Original code for', selectedElement.type, ':', originalCode);
      console.log('Current element type:', selectedElement.type);
      console.log('Current active page:', usePageStore.getState().activePage);
      
      // Send to Gemini API
      const modifiedCode = await modifyElementWithAI(
        { type: selectedElement.type, code: originalCode },
        prompt
      );
      
      // Check if we got a valid response
      if (!modifiedCode || modifiedCode.trim() === '') {
        throw new Error('Gemini returned empty code. Please try a different prompt.');
      }
      
      // Check if we got a fallback response (contains the fallback comment)
      if (modifiedCode.includes('This is a fallback response. The Gemini API was not available.')) {
        setError('The Gemini API is currently unavailable. A fallback response has been generated instead.');
        // Still update the component with the fallback response
        setLastModifiedElement(selectedElement.type, originalCode, modifiedCode);
        updateComponentFromPreview(selectedElement.type, modifiedCode);
        return;
      }
      
      console.log('Modified code from Gemini for', selectedElement.type, ':', modifiedCode);
      
      // Store the result in the editor store
      setLastModifiedElement(selectedElement.type, originalCode, modifiedCode);
      
      // Also update the corresponding file in the file store
      updateComponentFromPreview(selectedElement.type, modifiedCode);
      
      // Close the modal after successful processing
      setPrompt('');
      closeAIModal();
    } catch (err) {
      console.error('Error modifying element:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Unknown error processing your request. The Gemini API may be unavailable.';
      setError(errorMessage);
    } finally {
      stopProcessing();
    }
  };

  if (!isAIModalOpen || !selectedElement) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Edit {selectedElement.type} with Gemini
          </h3>
          <button
            onClick={closeAIModal}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Describe the changes you want to make to this {selectedElement.type.toLowerCase()}.
          </p>
          
          {selectedElement.code && (
            <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono overflow-auto max-h-32">
              <pre>{selectedElement.code}</pre>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`e.g. "Make this ${selectedElement.type.toLowerCase()} red and add an icon"`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeAIModal}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing with Gemini...
                </>
              ) : 'Send to Gemini'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 