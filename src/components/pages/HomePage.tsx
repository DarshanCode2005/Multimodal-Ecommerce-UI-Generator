'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useFileStore } from '../../store/fileStore';
import { componentToFileMap } from '../../services/componentSyncService';
import SelectableElement from '../SelectableElement';
import { renderJSXString } from '../../utils/jsxRenderer';

// Define sample products data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with long battery life.',
    price: 149.99
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Track your fitness goals and stay connected with this sleek smart watch.',
    price: 199.99
  },
  {
    id: 3,
    name: 'Portable Speaker',
    description: 'Waterproof Bluetooth speaker with immersive sound quality.',
    price: 79.99
  },
  {
    id: 4,
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum stand to improve your workspace setup.',
    price: 49.99
  },
  {
    id: 5,
    name: 'Wireless Charger',
    description: 'Fast charging pad compatible with all Qi-enabled devices.',
    price: 29.99
  },
  {
    id: 6,
    name: 'Backpack',
    description: 'Durable waterproof backpack with laptop compartment and USB charging port.',
    price: 69.99
  }
];

export default function HomePage() {
  const { selectedElement, setSelectedElement, openAIModal, lastModifiedElement } = useEditorStore();
  const { activeFileId, getFileContent } = useFileStore();
  const [dynamicContent, setDynamicContent] = useState<{[key: string]: string}>({});

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
    <div className="flex flex-col min-h-screen">
      <SelectableElement 
        elementType="Header" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'Header'}
      >
        {renderElement("Header", (
          <header className="bg-blue-600 text-white p-3 sm:p-4 md:p-5 w-full">
            <div className="container mx-auto px-2 sm:px-4 flex justify-between items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Home Page</h1>
              <nav className="hidden sm:block">
                <ul className="flex space-x-4">
                  <li><a href="#" className="hover:underline">Home</a></li>
                  <li><a href="#" className="hover:underline">Products</a></li>
                  <li><a href="#" className="hover:underline">About</a></li>
                </ul>
              </nav>
              <button className="block sm:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>
        ))}
      </SelectableElement>
      
      <main className="flex-grow p-3 sm:p-4 md:p-6 overflow-x-hidden">
        <div className="container mx-auto px-2 sm:px-4">
          <SelectableElement 
            elementType="Hero Section" 
            onSelect={handleElementSelect}
            isSelected={selectedElement?.type === 'Hero Section'}
          >
            {renderElement("Hero Section", (
              <div className="py-4 sm:py-8 md:py-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Welcome to our Website</h2>
                <p className="text-gray-700 text-sm sm:text-base max-w-xl mb-4">
                  Browse our collection of products and find the perfect item for you. We offer high quality
                  merchandise at competitive prices.
                </p>
                <p className="text-gray-700 text-sm sm:text-base max-w-xl mb-4">
                  Our products are carefully selected to ensure the highest quality and customer satisfaction.
                  We work directly with manufacturers to bring you the best products at the best prices.
                </p>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base">
                    Shop Now
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </SelectableElement>
          
          {/* Product Grid */}
          <SelectableElement 
            elementType="Product Grid" 
            onSelect={handleElementSelect}
            isSelected={selectedElement?.type === 'Product Grid'}
            className="mb-10 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {products.map((product, index) => (
                <SelectableElement
                  key={product.id}
                  elementType="Product Card"
                  onSelect={handleElementSelect}
                  isSelected={selectedElement?.type === 'Product Card'}
                  className="h-full"
                >
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col w-full h-full">
                    <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
                    <h3 className="font-semibold mb-1 text-sm">{product.name}</h3>
                    <p className="text-gray-600 text-xs mb-2 flex-grow">{product.description}</p>
                    <div className="mt-auto">
                      <p className="font-bold text-sm mb-2">${product.price.toFixed(2)}</p>
                      <button className="w-full bg-blue-600 text-white py-1 rounded text-xs">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </SelectableElement>
              ))}
            </div>
          </SelectableElement>
        </div>
      </main>
      
      <SelectableElement 
        elementType="Footer" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'Footer'}
        className="mt-auto"
      >
        {renderElement("Footer", (
          <footer className="bg-gray-800 text-white p-4 sm:p-6 w-full">
            <div className="container mx-auto px-2 sm:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Company</h3>
                  <ul className="text-xs sm:text-sm space-y-1">
                    <li><a href="#" className="hover:underline">About Us</a></li>
                    <li><a href="#" className="hover:underline">Contact</a></li>
                    <li><a href="#" className="hover:underline">Careers</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Support</h3>
                  <ul className="text-xs sm:text-sm space-y-1">
                    <li><a href="#" className="hover:underline">Help Center</a></li>
                    <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                    <li><a href="#" className="hover:underline">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Connect</h3>
                  <div className="flex justify-center sm:justify-start space-x-4">
                    <a href="#" className="hover:text-blue-400">Facebook</a>
                    <a href="#" className="hover:text-blue-400">Twitter</a>
                    <a href="#" className="hover:text-blue-400">Instagram</a>
                  </div>
                </div>
              </div>
              <div className="text-xs sm:text-sm mt-4 pt-4 border-t border-gray-700 text-center sm:text-left">
                &copy; 2023 Your Website. All rights reserved.
              </div>
            </div>
          </footer>
        ))}
      </SelectableElement>
    </div>
  );
} 