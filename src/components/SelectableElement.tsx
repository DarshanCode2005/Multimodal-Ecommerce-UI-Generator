'use client';

import React, { ReactNode, useState, useCallback, useEffect, Children } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import { componentToFileMap } from '../services/componentSyncService';
import { usePageStore } from '../store/pageStore';

type SelectableElementProps = {
  children: ReactNode;
  elementType: string;
  onSelect?: (element: { type: string; ref: HTMLElement; code: string }) => void;
  isSelected?: boolean;
  modifiedCode?: string;
  className?: string;
  id?: string;
};

export default function SelectableElement({ 
  children, 
  elementType, 
  onSelect, 
  isSelected, 
  modifiedCode, 
  className, 
  id 
}: SelectableElementProps) {
  const [hovered, setHovered] = useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const lastModifiedElement = useEditorStore((state) => state.lastModifiedElement);
  const { activeFileId, getFileContent } = useFileStore();
  
  // Check if this component's file is being edited
  const correspondingFileId = componentToFileMap[elementType];
  const isBeingEdited = activeFileId === correspondingFileId;
  
  // Extract the code from children
  const extractCode = useCallback(() => {
    try {
      // Get the current active page
      const activePage = usePageStore.getState().activePage;
      
      // For element types that should have their code displayed in a specific format
      // Home page components
      if (elementType === 'Button') {
        return `<button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
  Add to Cart
</button>`;
      } else if (elementType === 'Product Card') {
        return `<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 flex flex-col w-full h-full">
  <div className="h-32 sm:h-40 bg-gray-200 rounded-md mb-3 sm:mb-4 flex items-center justify-center">
    <span className="text-4xl sm:text-5xl">🎁</span>
  </div>
  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Featured Product</h3>
  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 flex-grow">High-quality product with amazing features.</p>
  <div className="mt-auto">
    <p className="font-bold text-base sm:text-lg mb-2 sm:mb-3">$99.99</p>
    <button className="w-full bg-blue-600 text-white py-1.5 sm:py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base">
      Add to Cart
    </button>
  </div>
</div>`;
      } else if (elementType === 'Header') {
        return `<header className="bg-blue-600 text-white p-3 sm:p-4 md:p-5">
  <div className="container mx-auto flex justify-between items-center">
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold">${activePage === 'home' ? 'Home' : activePage === 'shop' ? 'Shop' : activePage === 'product' ? 'Product' : 'Cart'} Page</h1>
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
</header>`;
      } else if (elementType === 'Footer') {
        return `<footer className="bg-gray-800 text-white p-4 sm:p-6 text-center sm:text-left">
  <div className="container mx-auto">
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
    <div className="text-xs sm:text-sm mt-4 pt-4 border-t border-gray-700">
      &copy; 2023 Your Website. All rights reserved.
    </div>
  </div>
</footer>`;
      }
      
      // Home page specific components
      else if (elementType === 'Hero Section') {
        return `<div className="py-6 sm:py-12 md:py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Welcome to our Website</h2>
    <p className="text-gray-700 text-sm sm:text-base max-w-xl">
      Browse our collection of products and find the perfect item for you. We offer high quality
      merchandise at competitive prices.
    </p>
    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
        Shop Now
      </button>
      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors">
        Learn More
      </button>
    </div>
  </div>
</div>`;
      } else if (elementType === 'Product Grid' && activePage === 'home') {
        return `<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
  {/* Product Card components will be rendered here */}
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col w-full h-full">
    <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
    <h3 className="font-semibold mb-1 text-sm">Product 1</h3>
    <p className="text-gray-600 text-xs mb-2 flex-grow">Product description here.</p>
    <div className="mt-auto">
      <p className="font-bold text-sm mb-2">$49.99</p>
      <button className="w-full bg-blue-600 text-white py-1 rounded text-xs">Add to Cart</button>
    </div>
  </div>
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col w-full h-full">
    <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
    <h3 className="font-semibold mb-1 text-sm">Product 2</h3>
    <p className="text-gray-600 text-xs mb-2 flex-grow">Product description here.</p>
    <div className="mt-auto">
      <p className="font-bold text-sm mb-2">$59.99</p>
      <button className="w-full bg-blue-600 text-white py-1 rounded text-xs">Add to Cart</button>
    </div>
  </div>
  <div className="hidden sm:block bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col w-full h-full">
    <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
    <h3 className="font-semibold mb-1 text-sm">Product 3</h3>
    <p className="text-gray-600 text-xs mb-2 flex-grow">Product description here.</p>
    <div className="mt-auto">
      <p className="font-bold text-sm mb-2">$69.99</p>
      <button className="w-full bg-blue-600 text-white py-1 rounded text-xs">Add to Cart</button>
    </div>
  </div>
  <div className="hidden md:block bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col w-full h-full">
    <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
    <h3 className="font-semibold mb-1 text-sm">Product 4</h3>
    <p className="text-gray-600 text-xs mb-2 flex-grow">Product description here.</p>
    <div className="mt-auto">
      <p className="font-bold text-sm mb-2">$79.99</p>
      <button className="w-full bg-blue-600 text-white py-1 rounded text-xs">Add to Cart</button>
    </div>
  </div>
</div>`;
      } 
      
      // Shop page specific components
      else if (elementType === 'Sidebar' && activePage === 'shop') {
        return `<div className="w-1/4 bg-white p-4 rounded-lg shadow border border-gray-200">
  <h2 className="font-semibold text-lg mb-4">Categories</h2>
  <ul className="space-y-2">
    <li className="p-2 bg-green-100 rounded cursor-pointer">All Products</li>
    <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Electronics</li>
    <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Clothing</li>
    <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Home & Garden</li>
    <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Sports</li>
  </ul>
  
  <h2 className="font-semibold text-lg mt-6 mb-4">Price Range</h2>
  <div className="space-y-2">
    <div className="flex items-center">
      <input type="checkbox" id="price1" className="mr-2" />
      <label htmlFor="price1">Under $50</label>
    </div>
    <div className="flex items-center">
      <input type="checkbox" id="price2" className="mr-2" />
      <label htmlFor="price2">$50 - $100</label>
    </div>
    <div className="flex items-center">
      <input type="checkbox" id="price3" className="mr-2" />
      <label htmlFor="price3">$100 - $200</label>
    </div>
    <div className="flex items-center">
      <input type="checkbox" id="price4" className="mr-2" />
      <label htmlFor="price4">Over $200</label>
    </div>
  </div>
</div>`;
      } else if (elementType === 'Product Header' && activePage === 'shop') {
        return `<div className="flex justify-between mb-4">
  <h2 className="text-xl font-semibold">All Products</h2>
  <select className="border rounded px-2 py-1">
    <option>Sort by: Featured</option>
    <option>Price: Low to High</option>
    <option>Price: High to Low</option>
    <option>Best Selling</option>
  </select>
</div>`;
      } else if (elementType === 'Pagination' && activePage === 'shop') {
        return `<div className="mt-6 flex justify-center">
  <div className="flex space-x-1">
    <button className="px-3 py-1 bg-green-600 text-white rounded">1</button>
    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">2</button>
    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">3</button>
    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">Next</button>
  </div>
</div>`;
      }
      
      // Product page specific components
      else if (elementType === 'Product Images' && activePage === 'product') {
        return `<div className="flex-shrink-0 w-full md:w-1/2 md:pr-8">
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="bg-gray-200 h-64 sm:h-80 rounded-lg flex items-center justify-center mb-4">
      <span className="text-6xl">📱</span>
    </div>
    <div className="grid grid-cols-4 gap-2">
      <div className="bg-gray-200 rounded-md h-16 flex items-center justify-center cursor-pointer border-2 border-blue-500">
        <span className="text-xl">📱</span>
      </div>
      <div className="bg-gray-200 rounded-md h-16 flex items-center justify-center cursor-pointer">
        <span className="text-xl">📱</span>
      </div>
      <div className="bg-gray-200 rounded-md h-16 flex items-center justify-center cursor-pointer">
        <span className="text-xl">📱</span>
      </div>
      <div className="bg-gray-200 rounded-md h-16 flex items-center justify-center cursor-pointer">
        <span className="text-xl">📱</span>
      </div>
    </div>
  </div>
</div>`;
      } else if (elementType === 'Product Details' && activePage === 'product') {
        return `<div className="w-full md:w-1/2">
  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Premium Wireless Earbuds</h1>
  <div className="flex items-center mb-2">
    <div className="flex text-yellow-400">
      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
    </div>
    <span className="text-gray-600 text-sm ml-2">36 reviews</span>
  </div>
  <p className="text-2xl font-bold text-blue-600 mb-4">$149.99</p>
  <p className="text-gray-600 mb-6">
    Experience crystal clear sound with our premium wireless earbuds. 
    Featuring 24-hour battery life, water resistance, and noise cancellation.
  </p>
  <div className="mb-6">
    <h3 className="font-semibold mb-2">Key Features:</h3>
    <ul className="list-disc pl-5 space-y-1 text-gray-600">
      <li>Active noise cancellation</li>
      <li>24-hour battery life with charging case</li>
      <li>Water and sweat resistant (IPX4)</li>
      <li>Touch controls for music and calls</li>
    </ul>
  </div>
  <div className="mb-6">
    <h3 className="font-semibold mb-2">Color:</h3>
    <div className="flex space-x-2">
      <div className="w-8 h-8 bg-black rounded-full cursor-pointer border-2 border-blue-500"></div>
      <div className="w-8 h-8 bg-white rounded-full cursor-pointer border border-gray-300"></div>
      <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
    </div>
  </div>
  <div className="mb-6">
    <h3 className="font-semibold mb-2">Quantity:</h3>
    <div className="flex">
      <button className="px-3 py-1 border border-gray-300 rounded-l">-</button>
      <input type="text" defaultValue="1" className="w-12 text-center border-t border-b border-gray-300" readOnly />
      <button className="px-3 py-1 border border-gray-300 rounded-r">+</button>
    </div>
  </div>
  <div className="flex space-x-4">
    <button className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-grow">
      Add to Cart
    </button>
    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
      ❤️
    </button>
  </div>
</div>`;
      } else if (elementType === 'Add to Cart Button' && activePage === 'product') {
        return `<button className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-grow">
  Add to Cart
</button>`;
      }
      
      // Cart page specific components
      else if (elementType === 'Cart Items' && activePage === 'cart') {
        return `<div className="bg-white rounded-lg shadow p-6 mb-4">
  <h2 className="text-xl font-semibold mb-4">Shopping Cart (3 items)</h2>
  
  <div className="divide-y divide-gray-200">
    <div className="py-4 flex flex-wrap md:flex-nowrap">
      <div className="w-full md:w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
        <span className="text-2xl">📱</span>
      </div>
      <div className="w-full md:flex-1 md:ml-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">Wireless Earbuds</h3>
            <p className="text-sm text-gray-500">Black</p>
          </div>
          <p className="font-semibold">$149.99</p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center">
            <button className="px-2 py-1 border border-gray-300 rounded-l">-</button>
            <input type="text" defaultValue="1" className="w-10 text-center border-t border-b border-gray-300" readOnly />
            <button className="px-2 py-1 border border-gray-300 rounded-r">+</button>
          </div>
          <button className="text-red-500 text-sm">Remove</button>
        </div>
      </div>
    </div>
    
    <div className="py-4 flex flex-wrap md:flex-nowrap">
      <div className="w-full md:w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
        <span className="text-2xl">🎧</span>
      </div>
      <div className="w-full md:flex-1 md:ml-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">Headphones</h3>
            <p className="text-sm text-gray-500">Silver</p>
          </div>
          <p className="font-semibold">$249.99</p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center">
            <button className="px-2 py-1 border border-gray-300 rounded-l">-</button>
            <input type="text" defaultValue="1" className="w-10 text-center border-t border-b border-gray-300" readOnly />
            <button className="px-2 py-1 border border-gray-300 rounded-r">+</button>
          </div>
          <button className="text-red-500 text-sm">Remove</button>
        </div>
      </div>
    </div>
    
    <div className="py-4 flex flex-wrap md:flex-nowrap">
      <div className="w-full md:w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
        <span className="text-2xl">🔋</span>
      </div>
      <div className="w-full md:flex-1 md:ml-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">Portable Charger</h3>
            <p className="text-sm text-gray-500">White</p>
          </div>
          <p className="font-semibold">$59.99</p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center">
            <button className="px-2 py-1 border border-gray-300 rounded-l">-</button>
            <input type="text" defaultValue="1" className="w-10 text-center border-t border-b border-gray-300" readOnly />
            <button className="px-2 py-1 border border-gray-300 rounded-r">+</button>
          </div>
          <button className="text-red-500 text-sm">Remove</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
      } else if (elementType === 'Cart Summary' && activePage === 'cart') {
        return `<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
  <div className="space-y-3 mb-4">
    <div className="flex justify-between">
      <span className="text-gray-600">Subtotal</span>
      <span>$459.97</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Shipping</span>
      <span>$9.99</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Tax</span>
      <span>$36.80</span>
    </div>
    <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
      <span>Total</span>
      <span>$506.76</span>
    </div>
  </div>
  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
    Proceed to Checkout
  </button>
</div>`;
      } else if (elementType === 'Checkout Button' && activePage === 'cart') {
        return `<button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
  Proceed to Checkout
</button>`;
      }
      
      // Try to extract from children if no predefined template is found
      const child = Children.only(children);
      if (React.isValidElement(child)) {
        return getElementAsString(child);
      }
      
      return `<${elementType}>
  Content of the ${elementType} component goes here
</${elementType}>`;
    } catch (error) {
      console.error('Error extracting code from element:', error);
      return `<${elementType}>Error extracting code</${elementType}>`;
    }
  }, [children, elementType]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (elementRef.current && onSelect) {
      // Get the current active page
      const currentPage = usePageStore.getState().activePage;
      
      // Extract the code for this component
      const code = extractCode();
      
      console.log(`Selected ${elementType} on ${currentPage} page`);
      
      // Pass the element data to the selection handler
      onSelect({ 
        type: elementType, 
        ref: elementRef.current, 
        code 
      });
    }
  }, [elementType, onSelect, extractCode]);

  useEffect(() => {
    // If this element was modified through the preview or AI
    if (lastModifiedElement && lastModifiedElement.type === elementType && isSelected) {
      console.log(`Element ${elementType} was modified, new code:`, lastModifiedElement.modifiedCode);
      // The actual rendering of the modified code is handled by the HomePage component
    }
    
    // If the corresponding file was modified in the editor
    if (isBeingEdited && correspondingFileId) {
      // We would typically update the element here, but it's already handled by the dynamic 
      // content rendering in the HomePage component
      console.log(`File for ${elementType} is being edited`);
    }
  }, [lastModifiedElement, elementType, isSelected, isBeingEdited, correspondingFileId]);

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative ${hovered ? 'cursor-pointer' : ''} ${className || ''}`}
      style={{ outline: hovered ? '1px dashed blue' : 'none' }}
      data-element-type={elementType}
    >
      {(hovered || isSelected || isBeingEdited) && (
        <div 
          className={`absolute top-0 left-0 z-10 px-2 py-1 text-xs text-white rounded-bl-sm ${
            isSelected ? 'bg-blue-600' : isBeingEdited ? 'bg-green-600' : 'bg-blue-400'
          }`}
        >
          {elementType} {isBeingEdited && '(Editing)'}
        </div>
      )}
      
      {(isSelected || isBeingEdited) && (
        <div className={`absolute inset-0 border-2 pointer-events-none z-10 ${
          isSelected ? 'border-blue-600' : 'border-green-600'
        }`}></div>
      )}
      
      {children}
    </div>
  );
}

// Helper function to stringify a React element
function getElementAsString(element: React.ReactElement): string {
  try {
    // For demonstration purposes, extract actual JSX by serializing the element props
    const { type, props } = element;
    const elementType = typeof type === 'string' ? type : 'Component';
    
    // Extract children content
    let childrenContent = '';
    
    if ((props as any).children) {
      if (typeof (props as any).children === 'string') {
        childrenContent = (props as any).children;
      } else if (React.isValidElement((props as any).children)) {
        childrenContent = `<Component />`;
      } else if (Array.isArray((props as any).children)) {
        childrenContent = '  <ChildComponents />';
      }
    }
    
    // Extract key props while avoiding complex objects
    const propsObj = props as Record<string, any>;
    const propsString = Object.entries(propsObj)
      .filter(([key]) => 
        key !== 'children' && 
        key !== 'ref' && 
        typeof propsObj[key] !== 'function' && 
        typeof propsObj[key] !== 'object'
      )
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        return `${key}={${value}}`;
      })
      .join(' ');
    
    // Return a proper JSX string representation
    if (childrenContent) {
      return `<${elementType} ${propsString}>
  ${childrenContent}
</${elementType}>`;
    } else {
      return `<${elementType} ${propsString} />`;
    }
  } catch (error) {
    console.error('Error converting element to string:', error);
    return `<div>Error extracting component code</div>`;
  }
} 