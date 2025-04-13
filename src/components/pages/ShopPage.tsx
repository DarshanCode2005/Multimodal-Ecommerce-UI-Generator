'use client';

import { useEditorStore } from '../../store/editorStore';
import SelectableElement from '../SelectableElement';

export default function ShopPage() {
  const { selectedElement, setSelectedElement, openAIModal } = useEditorStore();

  const handleElementSelect = (element: { type: string; ref: HTMLElement }) => {
    setSelectedElement(element);
    openAIModal();
  };

  return (
    <div className="h-full w-full flex flex-col">
      <SelectableElement 
        elementType="Header" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'Header'}
      >
        <header className="bg-green-600 text-white p-4">
          <h1 className="text-xl font-bold">Shop Page</h1>
        </header>
      </SelectableElement>
      
      <main className="flex-1 p-4">
        <div className="flex gap-4 mb-6">
          <SelectableElement 
            elementType="Sidebar" 
            onSelect={handleElementSelect}
            isSelected={selectedElement?.type === 'Sidebar'}
          >
            <div className="w-1/4 bg-white p-4 rounded-lg shadow border border-gray-200">
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
            </div>
          </SelectableElement>
          
          <div className="w-3/4">
            <SelectableElement 
              elementType="Product Header" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'Product Header'}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">All Products</h2>
                <select className="border rounded px-2 py-1">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Selling</option>
                </select>
              </div>
            </SelectableElement>
            
            <SelectableElement 
              elementType="Product Grid" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'Product Grid'}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((product) => (
                  <SelectableElement 
                    key={product}
                    elementType="Product Card" 
                    onSelect={handleElementSelect}
                    isSelected={selectedElement?.type === 'Product Card'}
                  >
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                      <div className="h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                      <h3 className="font-semibold">Product {product}</h3>
                      <p className="text-sm text-gray-600 mt-1 mb-2">Product description goes here</p>
                      <p className="font-bold">$99.99</p>
                      <SelectableElement 
                        elementType="Button" 
                        onSelect={handleElementSelect}
                        isSelected={selectedElement?.type === 'Button'}
                      >
                        <button className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700">
                          Add to Cart
                        </button>
                      </SelectableElement>
                    </div>
                  </SelectableElement>
                ))}
              </div>
            </SelectableElement>
            
            <SelectableElement 
              elementType="Pagination" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'Pagination'}
            >
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-1">
                  <button className="px-3 py-1 bg-green-600 text-white rounded">1</button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">2</button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">3</button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">Next</button>
                </div>
              </div>
            </SelectableElement>
          </div>
        </div>
      </main>
      
      <SelectableElement 
        elementType="Footer" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'Footer'}
      >
        <footer className="bg-gray-800 text-white p-4 text-center text-sm">
          &copy; 2023 Your Website. All rights reserved.
        </footer>
      </SelectableElement>
    </div>
  );
} 