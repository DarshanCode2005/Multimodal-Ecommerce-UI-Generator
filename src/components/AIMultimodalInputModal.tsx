'use client';

import { useState, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import { usePageStore } from '../store/pageStore';
import { updateComponentFromPreview } from '../services/componentSyncService';
import { modifyElementWithAI } from '../services/geminiService';

export default function AIMultimodalInputModal() {
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
  const [colorScheme, setColorScheme] = useState('');
  const [brandGuidelines, setBrandGuidelines] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'prompt'|'colors'|'images'>('prompt');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Process each file
    Array.from(files).forEach(file => {
      // Only process image files
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Extract the base64 data after the comma
        const base64Data = base64String.split(',')[1];
        setUploadedImages(prev => [...prev, base64Data]);
      };
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

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
      
      // Prepare multimodal data
      const multimodalData = {
        colorScheme: colorScheme || undefined,
        brandGuidelines: brandGuidelines || undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined
      };
      
      // Send to Gemini API with multimodal data
      const modifiedCode = await modifyElementWithAI(
        { type: selectedElement.type, code: originalCode },
        prompt,
        multimodalData
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
      
      // Reset state and close modal
      setPrompt('');
      setColorScheme('');
      setBrandGuidelines('');
      setUploadedImages([]);
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Edit {selectedElement.type} with Gemini AI
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
        
        {selectedElement.code && (
          <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono overflow-auto max-h-32">
            <pre>{selectedElement.code}</pre>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex border-b">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'prompt' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('prompt')}
            >
              Instructions
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'colors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('colors')}
            >
              Colors & Brand
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('images')}
            >
              Images
            </button>
          </div>
          
          <div className="mt-4">
            {activeTab === 'prompt' && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Describe the changes you want to make:</p>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`e.g. "Make this ${selectedElement.type.toLowerCase()} match our brand and incorporate the uploaded images"`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  disabled={isProcessing}
                />
              </div>
            )}
            
            {activeTab === 'colors' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Primary: #3B82F6, Secondary: #10B981, Accent: #F59E0B, Text: #1F2937, Background: #F9FAFB"
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Guidelines
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your brand style, typography preferences, and any other brand guidelines"
                    value={brandGuidelines}
                    onChange={(e) => setBrandGuidelines(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'images' && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload images for inspiration or to include in the design:
                </p>
                <p className="text-xs text-blue-600 mb-4">
                  Note: Images are used as inspiration only. Gemini will create design suggestions based on your images without directly processing them.
                </p>
                
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
                    disabled={isProcessing}
                  >
                    Upload Images
                  </button>
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={`data:image/jpeg;base64,${img}`} 
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                          disabled={isProcessing}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
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
              disabled={isProcessing || !prompt.trim()}
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