'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '../store/editorStore';

// Import Monaco Editor dynamically to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function ElementCodeEditor() {
  const { selectedElement, lastModifiedElement } = useEditorStore();
  const [code, setCode] = useState<string>('');
  const [isModified, setIsModified] = useState(false);
  const [elementType, setElementType] = useState<string | null>(null);

  // Update code when selected element changes
  useEffect(() => {
    if (selectedElement?.code) {
      setCode(selectedElement.code);
      setElementType(selectedElement.type);
      setIsModified(false);
      
      // Check if there's a modified version of this element
      if (lastModifiedElement && lastModifiedElement.type === selectedElement.type) {
        setCode(lastModifiedElement.modifiedCode);
        setIsModified(true);
      }
    }
  }, [selectedElement, lastModifiedElement]);

  // Update code when element is modified by AI
  useEffect(() => {
    if (lastModifiedElement && lastModifiedElement.type === elementType) {
      setCode(lastModifiedElement.modifiedCode);
      setIsModified(true);
    }
  }, [lastModifiedElement, elementType]);

  if (!selectedElement || !code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select an element to view and edit its code</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-2 border-b flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium text-sm">{selectedElement.type}</span>
          {isModified && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Modified by AI
            </span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            readOnly: true, // Read-only for simplicity in this demo
          }}
        />
      </div>
    </div>
  );
} 