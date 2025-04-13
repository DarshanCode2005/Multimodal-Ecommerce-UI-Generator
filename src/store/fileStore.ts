import { create } from 'zustand';

export type FileType = {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'file' | 'folder';
  children?: FileType[];
};

interface FileState {
  files: FileType[];
  activeFileId: string | null;
  setActiveFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  getFileById: (fileId: string) => FileType | undefined;
  getFileContent: (fileId: string) => string;
}

// Initial file structure
const initialFiles: FileType[] = [
  {
    id: 'src',
    name: 'src',
    path: '/src',
    content: '',
    type: 'folder',
    children: [
      {
        id: 'components',
        name: 'components',
        path: '/src/components',
        content: '',
        type: 'folder',
        children: [
          { 
            id: 'Header',
            name: 'Header.tsx',
            path: '/src/components/Header.tsx',
            content: `<header className="bg-blue-600 text-white p-4">
  <h1 className="text-xl font-bold">Home Page</h1>
</header>`,
            type: 'file'
          },
          { 
            id: 'Button',
            name: 'Button.tsx',
            path: '/src/components/Button.tsx',
            content: `<button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
  Add to Cart
</button>`,
            type: 'file' 
          },
          { 
            id: 'ProductCard',
            name: 'ProductCard.tsx',
            path: '/src/components/ProductCard.tsx',
            content: `<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
  <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
    <span className="text-5xl">🎁</span>
  </div>
  <h3 className="font-semibold mb-2">Featured Product 1</h3>
  <p className="text-gray-600 text-sm mb-3">High-quality product with amazing features.</p>
  <p className="font-bold text-lg mb-3">$99.99</p>
  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
    Add to Cart
  </button>
</div>`,
            type: 'file' 
          },
        ]
      },
      {
        id: 'pages',
        name: 'pages',
        path: '/src/pages',
        content: '',
        type: 'folder',
        children: [
          { 
            id: 'HomePage',
            name: 'HomePage.tsx',
            path: '/src/pages/HomePage.tsx',
            content: `<div className="h-full w-full flex flex-col">
  <header className="bg-blue-600 text-white p-4">
    <h1 className="text-xl font-bold">Home Page</h1>
  </header>
  
  <main className="flex-1 p-4">
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Welcome to our Website</h2>
      <p className="text-gray-700">
        Browse our collection of products and find the perfect item for you.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          <span className="text-5xl">🎁</span>
        </div>
        <h3 className="font-semibold mb-2">Featured Product 1</h3>
        <p className="text-gray-600 text-sm mb-3">High-quality product with amazing features.</p>
        <p className="font-bold text-lg mb-3">$99.99</p>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  </main>
  
  <footer className="bg-gray-800 text-white p-4 text-center text-sm">
    &copy; 2023 Your Website. All rights reserved.
  </footer>
</div>`,
            type: 'file' 
          },
          { 
            id: 'ShopPage',
            name: 'ShopPage.tsx',
            path: '/src/pages/ShopPage.tsx',
            content: `<div className="h-full w-full flex flex-col">
  <header className="bg-green-600 text-white p-4">
    <h1 className="text-xl font-bold">Shop Page</h1>
  </header>
  
  <main className="flex-1 p-4">
    <div className="flex justify-between mb-4">
      <h2 className="text-xl font-semibold">All Products</h2>
      <select className="border rounded px-2 py-1">
        <option>Sort by: Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Best Selling</option>
      </select>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((product) => (
        <div key={product} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="font-semibold">Product {product}</h3>
          <p className="text-sm text-gray-600 mt-1 mb-2">Product description goes here</p>
          <p className="font-bold">$99.99</p>
          <button className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </main>
</div>`,
            type: 'file' 
          },
          { 
            id: 'ProductPage',
            name: 'ProductPage.tsx',
            path: '/src/pages/ProductPage.tsx',
            content: `<div className="h-full w-full flex flex-col">
  <header className="bg-indigo-600 text-white p-4">
    <h1 className="text-xl font-bold">Product Page</h1>
  </header>
  
  <main className="flex-1 p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-6xl">📱</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="h-20 bg-gray-100 rounded cursor-pointer border-2 border-indigo-500 flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div className="h-20 bg-gray-100 rounded cursor-pointer flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div className="h-20 bg-gray-100 rounded cursor-pointer flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div className="h-20 bg-gray-100 rounded cursor-pointer flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Premium Smartphone</h1>
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
          </div>
          <span className="ml-2 text-sm text-gray-600">4.0 (125 reviews)</span>
        </div>
        
        <p className="text-3xl font-bold">$999.99</p>
        <p className="text-gray-700">The latest model with amazing features. This premium device offers cutting-edge technology, a beautiful display, and exceptional camera quality.</p>
        
        <div className="border-t border-b py-4">
          <h3 className="font-medium mb-2">Key Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>6.7-inch Super Retina display</li>
            <li>Triple camera system with Night mode</li>
            <li>All-day battery life</li>
            <li>Water and dust resistant</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <div>
            <h3 className="font-medium mb-2">Color:</h3>
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-black cursor-pointer ring-2 ring-indigo-500"></div>
              <div className="w-8 h-8 rounded-full bg-white border cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Quantity:</h3>
            <div className="flex">
              <button className="px-3 py-1 border rounded-l">-</button>
              <input type="text" value="1" className="w-12 text-center border-t border-b" />
              <button className="px-3 py-1 border rounded-r">+</button>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 pt-4">
          <button className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Add to Cart</button>
          <button className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-100">
            <span className="text-red-500">♥</span>
          </button>
        </div>
      </div>
    </div>
  </main>
  
  <footer className="bg-gray-800 text-white p-4 text-center text-sm">
    &copy; 2023 Your Website. All rights reserved.
  </footer>
</div>`,
            type: 'file' 
          },
          { 
            id: 'CartPage',
            name: 'CartPage.tsx',
            path: '/src/pages/CartPage.tsx',
            content: `<div className="h-full w-full flex flex-col">
  <header className="bg-purple-600 text-white p-4">
    <h1 className="text-xl font-bold">Shopping Cart</h1>
  </header>
  
  <main className="flex-1 p-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Your Items (3)</h2>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex">
          <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">📱</span>
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium">Premium Smartphone</h3>
              <p className="font-bold">$999.99</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">Color: Black</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border rounded">
                <button className="px-2 py-1">-</button>
                <span className="px-2">1</span>
                <button className="px-2 py-1">+</button>
              </div>
              <button className="text-red-500 text-sm">Remove</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex">
          <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🎧</span>
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium">Wireless Headphones</h3>
              <p className="font-bold">$149.99</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">Color: White</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border rounded">
                <button className="px-2 py-1">-</button>
                <span className="px-2">1</span>
                <button className="px-2 py-1">+</button>
              </div>
              <button className="text-red-500 text-sm">Remove</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex">
          <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">⌚</span>
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium">Smart Watch</h3>
              <p className="font-bold">$249.99</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">Color: Black</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border rounded">
                <button className="px-2 py-1">-</button>
                <span className="px-2">1</span>
                <button className="px-2 py-1">+</button>
              </div>
              <button className="text-red-500 text-sm">Remove</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-1">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>$1,399.97</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>$119.00</span>
            </div>
          </div>
          
          <div className="flex justify-between py-4 font-bold">
            <span>Total</span>
            <span>$1,518.97</span>
          </div>
          
          <button className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 mt-4">
            Proceed to Checkout
          </button>
          
          <div className="mt-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium">Promo Code</span>
            </div>
            <div className="flex mt-2">
              <input 
                type="text" 
                className="flex-1 border rounded-l px-3 py-2 focus:outline-none" 
                placeholder="Enter code"
              />
              <button className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <footer className="bg-gray-800 text-white p-4 text-center text-sm">
    &copy; 2023 Your Website. All rights reserved.
  </footer>
</div>`,
            type: 'file' 
          },
        ]
      }
    ]
  },
  {
    id: 'styles',
    name: 'styles',
    path: '/styles',
    content: '',
    type: 'folder',
    children: [
      { 
        id: 'Global',
        name: 'global.css',
        path: '/styles/global.css',
        content: `body {
  background: #f8f9fa;
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
}

.primary-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}`,
        type: 'file' 
      }
    ]
  }
];

// Helper function to find a file by ID in the tree structure
const findFileById = (files: FileType[], id: string): FileType | undefined => {
  for (const file of files) {
    if (file.id === id) {
      return file;
    }
    if (file.children) {
      const foundInChildren = findFileById(file.children, id);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return undefined;
};

// Helper function to update a file's content in the tree structure
const updateFileContentById = (files: FileType[], id: string, content: string): FileType[] => {
  return files.map(file => {
    if (file.id === id) {
      return { ...file, content };
    }
    if (file.children) {
      return {
        ...file,
        children: updateFileContentById(file.children, id, content)
      };
    }
    return file;
  });
};

export const useFileStore = create<FileState>((set, get) => ({
  files: initialFiles,
  activeFileId: null,
  
  setActiveFile: (fileId) => set({ activeFileId: fileId }),
  
  updateFileContent: (fileId, content) => set(state => ({
    files: updateFileContentById(state.files, fileId, content)
  })),
  
  getFileById: (fileId) => {
    return findFileById(get().files, fileId);
  },
  
  getFileContent: (fileId) => {
    const file = findFileById(get().files, fileId);
    return file ? file.content : '';
  }
})); 