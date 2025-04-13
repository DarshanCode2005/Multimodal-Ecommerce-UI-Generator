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
      
      // First, try to get the actual component code from the file if it's mapped
      const fileId = componentToFileMap[elementType];
      if (fileId) {
        const content = getFileContent(fileId);
        if (content && content.trim().length > 0) {
          // If we have content for this component, return it directly
          return content;
        }
      }
      
      // Fallback to predefined templates if no file content is available
      // For element types that should have their code displayed in a specific format
      // Dashboard page specific components
      if (activePage === 'dashboard') {
        if (elementType === 'Dashboard Header' || elementType === 'DashboardHeader') {
          return `<header className="bg-blue-600 text-white p-4 mb-6">
  <div className="container mx-auto">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center">
        <div className="relative mr-4">
          <input
            type="text"
            placeholder="Search..."
            className="bg-blue-700 text-white pl-8 pr-4 py-1 rounded-full focus:outline-none focus:bg-blue-500"
          />
          <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
            <span className="text-white">JD</span>
          </div>
          <span>John Doe</span>
        </div>
      </div>
    </div>
  </div>
</header>`;
        } else if (elementType === 'Dashboard Sidebar' || elementType === 'DashboardSidebar') {
          return `<aside className="w-full lg:w-1/4 bg-white rounded-lg shadow-md p-4">
  <nav>
    <ul className="space-y-2">
      <li className="bg-blue-50 text-blue-700 rounded p-2 font-medium">
        <a href="#" className="flex items-center">
          <span className="mr-3">📊</span> Dashboard
        </a>
      </li>
      <li className="hover:bg-gray-50 rounded p-2">
        <a href="#" className="flex items-center">
          <span className="mr-3">🛒</span> Orders
        </a>
      </li>
      <li className="hover:bg-gray-50 rounded p-2">
        <a href="#" className="flex items-center">
          <span className="mr-3">📦</span> Products
        </a>
      </li>
      <li className="hover:bg-gray-50 rounded p-2">
        <a href="#" className="flex items-center">
          <span className="mr-3">👥</span> Customers
        </a>
      </li>
      <li className="hover:bg-gray-50 rounded p-2">
        <a href="#" className="flex items-center">
          <span className="mr-3">📈</span> Analytics
        </a>
      </li>
      <li className="hover:bg-gray-50 rounded p-2">
        <a href="#" className="flex items-center">
          <span className="mr-3">⚙️</span> Settings
        </a>
      </li>
    </ul>
  </nav>
</aside>`;
        } else if (elementType === 'Dashboard Summary' || elementType === 'DashboardSummary') {
          return `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Total Revenue</p>
        <h3 className="text-2xl font-bold">$24,568</h3>
        <p className="text-green-500 text-sm">+12% from last month</p>
      </div>
      <div className="p-3 bg-blue-100 rounded-full text-blue-600">💰</div>
    </div>
  </div>
  
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Orders</p>
        <h3 className="text-2xl font-bold">345</h3>
        <p className="text-green-500 text-sm">+8% from last month</p>
      </div>
      <div className="p-3 bg-green-100 rounded-full text-green-600">🛒</div>
    </div>
  </div>
  
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Customers</p>
        <h3 className="text-2xl font-bold">1,248</h3>
        <p className="text-green-500 text-sm">+5% from last month</p>
      </div>
      <div className="p-3 bg-purple-100 rounded-full text-purple-600">👥</div>
    </div>
  </div>
  
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Avg. Order Value</p>
        <h3 className="text-2xl font-bold">$71.21</h3>
        <p className="text-red-500 text-sm">-2% from last month</p>
      </div>
      <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">📊</div>
    </div>
  </div>
</div>`;
        } else if (elementType === 'Recent Orders' || elementType === 'RecentOrders') {
          return `<div className="bg-white rounded-lg shadow-md p-6 mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">Recent Orders</h2>
    <a href="#" className="text-blue-600 hover:underline text-sm">View All</a>
  </div>
  
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-4 py-2 text-left">Order ID</th>
          <th className="px-4 py-2 text-left">Customer</th>
          <th className="px-4 py-2 text-left">Products</th>
          <th className="px-4 py-2 text-left">Date</th>
          <th className="px-4 py-2 text-left">Amount</th>
          <th className="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        <tr>
          <td className="px-4 py-3">#ORD-12345</td>
          <td className="px-4 py-3">John Smith</td>
          <td className="px-4 py-3">3</td>
          <td className="px-4 py-3">June 10, 2023</td>
          <td className="px-4 py-3 font-medium">$128.99</td>
          <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span></td>
        </tr>
        <tr>
          <td className="px-4 py-3">#ORD-12344</td>
          <td className="px-4 py-3">Sarah Johnson</td>
          <td className="px-4 py-3">1</td>
          <td className="px-4 py-3">June 9, 2023</td>
          <td className="px-4 py-3 font-medium">$59.99</td>
          <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Shipped</span></td>
        </tr>
        <tr>
          <td className="px-4 py-3">#ORD-12343</td>
          <td className="px-4 py-3">Michael Brown</td>
          <td className="px-4 py-3">5</td>
          <td className="px-4 py-3">June 8, 2023</td>
          <td className="px-4 py-3 font-medium">$274.50</td>
          <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span></td>
        </tr>
        <tr>
          <td className="px-4 py-3">#ORD-12342</td>
          <td className="px-4 py-3">Emily Davis</td>
          <td className="px-4 py-3">2</td>
          <td className="px-4 py-3">June 7, 2023</td>
          <td className="px-4 py-3 font-medium">$89.97</td>
          <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span></td>
        </tr>
        <tr>
          <td className="px-4 py-3">#ORD-12341</td>
          <td className="px-4 py-3">Robert Wilson</td>
          <td className="px-4 py-3">4</td>
          <td className="px-4 py-3">June 6, 2023</td>
          <td className="px-4 py-3 font-medium">$149.95</td>
          <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Cancelled</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;
        }
      }

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
      
      // Search page specific components
      else if (elementType === 'SearchHeader') {
        return `<header className="bg-blue-600 text-white p-4">
  <div className="container mx-auto max-w-full">
    <h1 className="text-xl font-bold mb-2">Search Results</h1>
    <div className="flex items-center mb-4">
      <span className="text-xl mr-2">🔍</span>
      <p>{searchQuery ? \`Results for "\${searchQuery}"\` : 'All Products'}</p>
      <p className="ml-2 text-sm text-blue-200">({filteredProducts.length} products found)</p>
    </div>
    
    <form onSubmit={handleSearch} className="flex max-w-3xl relative">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search products, categories, or tags..."
          className="w-full px-4 py-3 text-gray-800 bg-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchInput}
          onChange={handleSearchInputChange}
          onFocus={() => searchInput.length >= 2 && setShowSuggestions(searchSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {searchInput && (
          <button 
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchInput('');
              setSearchSuggestions([]);
              setShowSuggestions(false);
            }}
          >
            ✕
          </button>
        )}
        
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1">
            <ul>
              {searchSuggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                  onClick={() => {
                    setSearchInput(suggestion);
                    setShowSuggestions(false);
                    setSearchQuery(suggestion);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button 
        type="submit"
        className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-r-lg flex items-center justify-center transition-colors"
      >
        <span className="mr-2">Search</span>
        <span>🔍</span>
      </button>
    </form>
  </div>
</header>`;
      } else if (elementType === 'SearchSidebar') {
        return `<div className="bg-white p-4 rounded-lg shadow border border-gray-200">
  <h2 className="font-semibold text-lg mb-4 pb-2 border-b">Filters</h2>
  
  <div className="mb-6">
    <h3 className="font-medium mb-2">Categories</h3>
    <div className="space-y-2">
      <div className="flex items-center">
        <input 
          type="checkbox" 
          id="category-electronics" 
          className="mr-2" 
        />
        <label htmlFor="category-electronics">Electronics</label>
      </div>
    </div>
  </div>
  
  <div className="mb-6">
    <h3 className="font-medium mb-2">Price Range</h3>
    <div className="flex items-center space-x-2 mb-2">
      <span className="text-sm">$0</span>
      <input 
        type="range" 
        min="0" 
        max="1000" 
        step="10"
        value="0"
        className="flex-1"
      />
      <span className="text-sm">$1000</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm">$0</span>
      <input 
        type="range" 
        min="0" 
        max="1000" 
        step="10"
        value="1000"
        className="flex-1"
      />
      <span className="text-sm">$1000</span>
    </div>
  </div>
  
  <div className="mb-6">
    <h3 className="font-medium mb-2">Customer Rating</h3>
    <div className="space-y-2">
      <div className="flex items-center">
        <input 
          type="radio" 
          id="rating-4" 
          name="rating"
          className="mr-2" 
        />
        <label htmlFor="rating-4" className="flex items-center">
          4+ <span className="ml-1 text-yellow-500">★</span>
        </label>
      </div>
      <div className="flex items-center">
        <input 
          type="radio" 
          id="rating-3" 
          name="rating"
          className="mr-2" 
        />
        <label htmlFor="rating-3" className="flex items-center">
          3+ <span className="ml-1 text-yellow-500">★</span>
        </label>
      </div>
      {/* More ratings... */}
    </div>
  </div>
  
  <div className="mb-6">
    <div className="flex items-center">
      <input 
        type="checkbox" 
        id="inStock" 
        className="mr-2" 
        checked={showInStock}
        onChange={(e) => {
          setShowInStock(e.target.checked);
          setCurrentPage(1);
        }}
      />
      <label htmlFor="inStock">In Stock Only</label>
    </div>
  </div>
  
  <button 
    onClick={() => {
      setSelectedCategories([]);
      setPriceRange([0, 1000]);
      setMinRating(0);
      setShowInStock(false);
      setCurrentPage(1);
    }}
    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition-colors"
  >
    Clear All Filters
  </button>
</div>`;
      } else if (elementType === 'SearchControls') {
        return `<div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
    <p className="mb-2 sm:mb-0">
      <span className="font-medium">0</span> results found
    </p>
    <div className="flex items-center">
      <label htmlFor="sort-by" className="mr-2 whitespace-nowrap">Sort by:</label>
      <select 
        id="sort-by" 
        className="border rounded px-2 py-1"
      >
        <option value="relevance">Relevance</option>
        <option value="priceLow">Price: Low to High</option>
        <option value="priceHigh">Price: High to Low</option>
        <option value="rating">Customer Rating</option>
      </select>
    </div>
  </div>
</div>`;
      } else if (elementType === 'SearchResults') {
        return `<div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5">
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
      <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
        <span className="text-5xl">📱</span>
      </div>
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">Product Name</h3>
          <div className="flex items-center text-sm text-yellow-500 ml-2">
            <span>4.5</span>
            <span className="ml-1">★</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1 mb-2">Product description goes here.</p>
        <div className="mt-1 text-xs">
          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Category
          </span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <p className="font-bold text-lg">$99.99</p>
        <div className="flex items-center">
          <span className="text-xs text-green-600 mr-2">In Stock</span>
          <button 
            className="px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`;
      } else if (elementType === 'SearchPagination') {
        return `<div className="mt-8 flex justify-center">
  <div className="flex items-center space-x-1">
    <button 
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
    >
      Previous
    </button>
    
    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
      // Logic to show pages around current page
      let pageNum;
      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (currentPage <= 3) {
        pageNum = i + 1;
      } else if (currentPage >= totalPages - 2) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = currentPage - 2 + i;
      }
      
      return (
        <button 
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
        >
          {pageNum}
        </button>
      );
    })}
    
    <button 
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
    >
      Next
    </button>
  </div>
</div>`;
      }
      
      // Try to extract from children if no predefined template is found
      if (React.isValidElement(children)) {
        try {
          return getElementAsString(children as React.ReactElement);
        } catch (err) {
          console.error('Error extracting code from children:', err);
        }
      }
      
      // Fallback for unknown element types
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
    if (!element || typeof element !== 'object') {
      return '<div>Invalid element</div>';
    }
    
    const { type, props } = element;
    const elementType = typeof type === 'string' ? type : 'Component';

    // Safely extract className if it exists
    let className = '';
    if (props && typeof props === 'object' && 'className' in props) {
      className = String(props.className || '');
    }
    
    // Get the current active page safely
    let activePage = 'home';
    try {
      const pageStore = usePageStore.getState();
      if (pageStore && pageStore.activePage) {
        activePage = pageStore.activePage;
      }
    } catch (e) {
      console.error('Error getting active page:', e);
    }
    
    // Return predefined templates based on active page and element type
    if (activePage === 'dashboard') {
      if (elementType === 'DashboardHeader' || String(type).includes('DashboardHeader')) {
        return `<header className="bg-blue-600 text-white p-4 mb-6">
  <div className="container mx-auto">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <!-- Dashboard header content -->
  </div>
</header>`;
      }
      
      if (elementType === 'DashboardSidebar' || String(type).includes('DashboardSidebar')) {
        return `<aside className="bg-white rounded-lg shadow p-4">
  <nav>
    <ul className="space-y-2">
      <!-- Sidebar navigation items -->
    </ul>
  </nav>
</aside>`;
      }
      
      return `<div className="dashboard-component">
  <!-- Dashboard component -->
</div>`;
    }
    
    if (activePage === 'search') {
      if (elementType === 'Header' || String(type).includes('Header')) {
        return `<header className="bg-blue-600 text-white p-4">
  <!-- Search header content -->
</header>`;
      }
      
      if (elementType === 'Sidebar' || String(type).includes('Sidebar')) {
        return `<div className="bg-white p-4 rounded-lg shadow border border-gray-200">
  <!-- Search filters content -->
</div>`;
      }
      
      return `<div className="search-component">
  <!-- Search component -->
</div>`;
    }
    
    // For unknown components, just return a simple representation
    return `<${elementType} className="${className}" />`;
  } catch (error) {
    console.error('Error converting element to string:', error);
    return `<div>Error extracting component code</div>`;
  }
} 