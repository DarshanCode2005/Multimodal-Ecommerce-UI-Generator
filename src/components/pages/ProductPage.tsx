'use client';

import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import SelectableElement from '../SelectableElement';

export default function ProductPage() {
  const { selectedElement, setSelectedElement, openAIModal } = useEditorStore();
  const [quantity, setQuantity] = useState(1);

  const handleElementSelect = (element: { type: string; ref: HTMLElement; code: string }) => {
    setSelectedElement(element);
    openAIModal();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <SelectableElement 
        elementType="Header" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'Header'}
      >
        <header className="bg-purple-600 text-white p-4">
          <h1 className="text-xl font-bold">Product Page</h1>
        </header>
      </SelectableElement>
      
      <main className="flex-1 p-4">
        <div className="mb-3">
          <nav className="text-sm text-gray-500">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <a href="#" className="hover:underline">Home</a>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <a href="#" className="hover:underline">Shop</a>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span>Premium Headphones</span>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <SelectableElement 
            elementType="Product Images" 
            onSelect={handleElementSelect}
            isSelected={selectedElement?.type === 'Product Images'}
          >
            <div className="md:w-1/2">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-9xl">🎧</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="bg-gray-100 rounded p-2 flex items-center justify-center border-2 border-purple-500">
                  <span className="text-2xl">🎧</span>
                </div>
                <div className="bg-gray-100 rounded p-2 flex items-center justify-center">
                  <span className="text-2xl">🎧</span>
                </div>
                <div className="bg-gray-100 rounded p-2 flex items-center justify-center">
                  <span className="text-2xl">🎧</span>
                </div>
                <div className="bg-gray-100 rounded p-2 flex items-center justify-center">
                  <span className="text-2xl">🎧</span>
                </div>
              </div>
            </div>
          </SelectableElement>
          
          <SelectableElement 
            elementType="Product Details" 
            onSelect={handleElementSelect}
            isSelected={selectedElement?.type === 'Product Details'}
          >
            <div className="md:w-1/2">
              <h1 className="text-2xl font-bold mb-2">Premium Wireless Headphones</h1>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="ml-2 text-sm text-gray-600">128 reviews</span>
              </div>
              
              <p className="text-3xl font-bold mb-4">$199.99</p>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Experience crystal-clear sound with our premium wireless headphones. 
                  Featuring active noise cancellation, 30-hour battery life, and comfortable ear cushions for extended listening sessions.
                </p>
                
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>Bluetooth 5.0 connectivity</li>
                  <li>Active noise cancellation</li>
                  <li>30-hour battery life</li>
                  <li>Quick charge: 5 hours of playback from 10 minutes of charging</li>
                  <li>Built-in microphone for calls</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Color</h3>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-black rounded-full border-2 border-purple-500"></button>
                  <button className="w-8 h-8 bg-white rounded-full border border-gray-300"></button>
                  <button className="w-8 h-8 bg-blue-600 rounded-full"></button>
                  <button className="w-8 h-8 bg-red-600 rounded-full"></button>
                </div>
              </div>
              
              <div className="flex mb-6">
                <div className="w-1/3 mr-4">
                  <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                    className="w-full border border-gray-300 rounded px-3 py-2" 
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <SelectableElement 
                  elementType="Add to Cart Button" 
                  onSelect={handleElementSelect}
                  isSelected={selectedElement?.type === 'Add to Cart Button'}
                >
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold flex-grow">
                    Add to Cart
                  </button>
                </SelectableElement>
                <button className="border border-gray-300 hover:bg-gray-100 px-4 py-3 rounded-md">
                  ❤️
                </button>
              </div>
            </div>
          </SelectableElement>
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