'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFileStore } from '../store/fileStore';
import { updatePreviewFromEditor } from '../services/componentSyncService';

// Import Monaco Editor dynamically to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function FileCodeEditor() {
  const { activeFileId, getFileById, updateFileContent } = useFileStore();
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');

  // Get active file data
  const activeFile = activeFileId ? getFileById(activeFileId) : null;

  // Update code when active file changes
  useEffect(() => {
    if (activeFile) {
      setCode(activeFile.content);
      
      // Set language based on file extension
      if (activeFile.name.endsWith('.css')) {
        setLanguage('css');
      } else if (activeFile.name.endsWith('.html')) {
        setLanguage('html');
      } else if (activeFile.name.endsWith('.tsx') || activeFile.name.endsWith('.ts')) {
        setLanguage('typescript');
      } else if (activeFile.name.endsWith('.js')) {
        setLanguage('javascript');
      } else if (activeFile.name.endsWith('.json')) {
        setLanguage('json');
      }
    }
  }, [activeFile]);

  // Handle code changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      
      if (activeFileId) {
        updateFileContent(activeFileId, value);
        // Sync with preview
        updatePreviewFromEditor(activeFileId);
      }
    }
  };

  if (!activeFileId || !activeFile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a file to view and edit</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-2 border-b flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium text-sm">{activeFile.name}</span>
          <span className="ml-2 text-xs text-gray-500">{activeFile.path}</span>
        </div>
        <div className="text-xs bg-gray-200 px-2 py-1 rounded">
          {language}
        </div>
      </div>

      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
          }}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
} 