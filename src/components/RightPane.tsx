'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore, FileType } from '../store/fileStore';
import { updatePreviewFromEditor, openComponentFile } from '../services/componentSyncService';
import ElementCodeEditor from './ElementCodeEditor';
import FileCodeEditor from './FileCodeEditor';
import LoginCodeEditor from './LoginCodeEditor';
import { usePageStore } from '../store/pageStore';

export interface RightPaneProps {
  isVisible: boolean;
}

export default function RightPane({ isVisible }: RightPaneProps) {
  const [activeTab, setActiveTab] = useState<'explorer' | 'element'>('explorer');
  const selectedElement = useEditorStore((state) => state.selectedElement);
  const { files, activeFileId, setActiveFile, updateFileContent, getFileById } = useFileStore();
  const { activePage } = usePageStore();
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'src': true,
    'components': true,
    'pages': true,
  });

  // Effect to switch to element tab when an element is selected
  useEffect(() => {
    if (selectedElement) {
      setActiveTab('element');
    }
  }, [selectedElement]);

  const toggleFolder = (folderId: string) => {
    setOpenFolders({
      ...openFolders,
      [folderId]: !openFolders[folderId]
    });
  };
  
  const handleFileSelect = (fileId: string) => {
    setActiveFile(fileId);
    setActiveTab('explorer');
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
      
      // Sync changes to the preview
      updatePreviewFromEditor(activeFileId);
    }
  };

  // When a component is selected in the preview, open the corresponding file
  useEffect(() => {
    if (selectedElement?.type) {
      openComponentFile(selectedElement.type);
    }
  }, [selectedElement]);

  // Function to render the file tree recursively
  const renderFileTree = (items: FileType[], level = 0) => {
    return items.map(item => {
      const isOpen = openFolders[item.id];
      
      return (
        <div key={item.id} style={{ marginLeft: `${level * 12}px` }}>
          <div 
            onClick={() => item.type === 'folder' ? toggleFolder(item.id) : handleFileSelect(item.id)}
            className={`flex items-center p-1 rounded cursor-pointer hover:bg-gray-200 ${activeFileId === item.id ? 'bg-blue-100' : ''}`}
          >
            <span className="mr-1">
              {item.type === 'folder' ? (isOpen ? '📂' : '📁') : '📄'}
            </span>
            <span className="text-sm">{item.name}</span>
          </div>
          
          {item.type === 'folder' && isOpen && item.children && (
            <div className="mt-1">
              {renderFileTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Get the active file content
  const activeFile = activeFileId ? getFileById(activeFileId) : null;
  const fileContent = activeFile?.content || '';

  return (
    <div className={`w-96 h-full bg-white border-l flex flex-col transition-all duration-300 overflow-hidden ${isVisible ? 'block' : 'hidden'}`}>
      <div className="border-b flex">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'explorer' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('explorer')}
        >
          Explorer
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'element' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('element')}
          disabled={!selectedElement}
        >
          Selected Element
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'explorer' ? (
          <div className="flex h-full">
            <div className="w-1/3 border-r p-2 overflow-y-auto">
              {renderFileTree(files)}
            </div>
            
            <div className="w-2/3 h-full flex flex-col">
              {activePage === 'login' ? (
                <LoginCodeEditor />
              ) : (
                <FileCodeEditor />
              )}
            </div>
          </div>
        ) : (
          <ElementCodeEditor />
        )}
      </div>
    </div>
  );
} 