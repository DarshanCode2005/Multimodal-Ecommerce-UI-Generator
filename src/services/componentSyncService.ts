'use client';

import { useFileStore } from '../store/fileStore';
import { useEditorStore } from '../store/editorStore';
import { usePageStore } from '../store/pageStore';

// Map component types to file IDs for direct editing
export const componentToFileMap: Record<string, string> = {
  // Global components
  'Header': 'Header',
  'Button': 'Button',
  'Footer': 'Footer',
  
  // Home page components
  'Hero Section': 'HomePage',
  'Product Grid': 'HomePage',
  
  // Shop page components
  'Sidebar': 'ShopPage',
  'Product Header': 'ShopPage',
  'Product Card': 'ShopPage',
  'Pagination': 'ShopPage',
  
  // Product page components
  'Product Images': 'ProductPage',
  'Product Details': 'ProductPage',
  'Add to Cart Button': 'ProductPage',
  
  // Cart page components
  'Cart Items': 'CartPage',
  'Cart Summary': 'CartPage',
  'Checkout Button': 'CartPage',
};

// Map filenames to page types
export const fileToPageMap: Record<string, string> = {
  'HomePage': 'home',
  'ShopPage': 'shop',
  'ProductPage': 'product',
  'CartPage': 'cart'
};

// Map page types to filenames
export const pageToFileMap: Record<string, string> = {
  'home': 'HomePage',
  'shop': 'ShopPage',
  'product': 'ProductPage',
  'cart': 'CartPage'
};

/**
 * Opens the file corresponding to a selected component
 * @param componentType The type of the selected component
 */
export function openComponentFile(componentType: string): void {
  const fileId = componentToFileMap[componentType];
  if (fileId) {
    const { setActiveFile } = useFileStore.getState();
    setActiveFile(fileId);
  }
}

/**
 * Updates the component in the editor when modified in the preview
 * @param componentType The type of the component
 * @param newContent The new content for the component
 */
export function updateComponentFromPreview(componentType: string, newContent: string): void {
  // Get the current active page to determine which file to update
  const activePage = usePageStore.getState().activePage;
  const activePageFile = pageToFileMap[activePage];
  
  // Default to using the component's mapped file
  let fileId = componentToFileMap[componentType];
  
  // Check if this is a page-specific component (like Product Images on product page)
  const pagePrefixes = {
    'product': ['Product Images', 'Product Details', 'Add to Cart Button'],
    'shop': ['Sidebar', 'Product Header', 'Product Card', 'Pagination'],
    'cart': ['Cart Items', 'Cart Summary', 'Checkout Button'],
    'home': ['Hero Section', 'Product Grid']
  };
  
  // If the component belongs to a specific page, make sure we're updating the right file
  // based on the active page context
  for (const [page, components] of Object.entries(pagePrefixes)) {
    if (components.includes(componentType)) {
      // Only update if we're on the matching page - this ensures AI edits affect only the selected page
      if (activePage === page) {
        fileId = pageToFileMap[page];
        console.log(`Updating ${componentType} in ${fileId} as we're on ${activePage} page`);
      } else {
        console.log(`Not updating ${componentType} as we're on ${activePage} page, not ${page}`);
        return; // Don't update if we're not on the right page
      }
      break;
    }
  }
  
  if (fileId) {
    const { updateFileContent, setActiveFile } = useFileStore.getState();
    
    // Set the active file to the one being edited
    setActiveFile(fileId);
    
    // Update the file content
    updateFileContent(fileId, newContent);
    
    // Also update the editor store with the change
    const { setLastModifiedElement } = useEditorStore.getState();
    setLastModifiedElement(componentType, '', newContent);
    
    console.log(`Updating component ${componentType} in file ${fileId} for page ${activePage}`);
    
    // Additionally, update the active page in the page store if needed
    if (fileToPageMap[fileId] && fileToPageMap[fileId] !== activePage) {
      const { setActivePage } = usePageStore.getState();
      setActivePage(fileToPageMap[fileId] as any);
    }
  } else {
    console.error(`No file mapping found for component type: ${componentType}`);
  }
}

/**
 * Updates the preview when a file is modified in the editor
 * @param fileId The ID of the file that was modified
 */
export function updatePreviewFromEditor(fileId: string): void {
  // Find which component types correspond to this file
  const matchingComponents = Object.entries(componentToFileMap)
    .filter(([_, fId]) => fId === fileId)
    .map(([compType]) => compType);

  if (matchingComponents.length > 0) {
    // Get the file content
    const { getFileContent } = useFileStore.getState();
    const content = getFileContent(fileId);
    
    // Update the last modified element in the editor store
    const { setLastModifiedElement } = useEditorStore.getState();
    
    // Just update the first matching component for simplicity
    // In a real implementation you'd need to be more sophisticated
    // to extract the right section from the file
    setLastModifiedElement(matchingComponents[0], '', content);
    
    // Update the active page in the page store if needed
    if (fileToPageMap[fileId]) {
      const { setActivePage } = usePageStore.getState();
      setActivePage(fileToPageMap[fileId] as any);
    }
  }
}

/**
 * Hook to connect the editor and preview
 * Call this in components that need to coordinate between editor and preview
 */
export function useSyncComponents() {
  return {
    openComponentFile,
    updateComponentFromPreview,
    updatePreviewFromEditor
  };
} 