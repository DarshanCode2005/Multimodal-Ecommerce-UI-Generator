'use client';

import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import SelectableElement from '../SelectableElement';

export default function CartPage() {
  const { selectedElement, setSelectedElement, openAIModal } = useEditorStore();
  const [quantities, setQuantities] = useState({
    item1: 1,
    item2: 2,
    item3: 1
  });
  const [couponCode, setCouponCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleElementSelect = (element: { type: string; ref: HTMLElement; code: string }) => {
    setSelectedElement(element);
    openAIModal();
  };

  const handleQuantityChange = (item: string, value: number) => {
    if (value > 0) {
      setQuantities(prev => ({
        ...prev,
        [item]: value
      }));
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <SelectableElement 
        elementType="Header" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'Header'}
      >
        <header className="bg-red-600 text-white p-4">
          <h1 className="text-xl font-bold">Shopping Cart</h1>
        </header>
      </SelectableElement>
      
      <main className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart (3 items)</h2>
          
          <SelectableElement 
            elementType="Cart Items" 
            onSelect={handleElementSelect}
            isSelected={selectedElement?.type === 'Cart Items'}
          >
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="text-left p-4">Product</th>
                      <th className="text-center p-4">Quantity</th>
                      <th className="text-right p-4">Price</th>
                      <th className="text-right p-4">Total</th>
                      <th className="text-right p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                            <span className="text-2xl">🎧</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">Premium Wireless Headphones</h3>
                            <p className="text-sm text-gray-600">Black</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <div className="flex border border-gray-300 rounded">
                            <button 
                              className="px-3 py-1 bg-gray-100"
                              onClick={() => handleQuantityChange('item1', quantities.item1 - 1)}
                            >-</button>
                            <input 
                              type="text" 
                              value={quantities.item1} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) handleQuantityChange('item1', val);
                              }}
                              className="w-12 text-center border-x border-gray-300" 
                            />
                            <button 
                              className="px-3 py-1 bg-gray-100"
                              onClick={() => handleQuantityChange('item1', quantities.item1 + 1)}
                            >+</button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">$199.99</td>
                      <td className="p-4 text-right font-semibold">${(199.99 * quantities.item1).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button className="text-red-600 hover:text-red-800">Remove</button>
                      </td>
                    </tr>
                    
                    <tr className="border-b">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                            <span className="text-2xl">📱</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">Smartphone Case</h3>
                            <p className="text-sm text-gray-600">Blue</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <div className="flex border border-gray-300 rounded">
                            <button 
                              className="px-3 py-1 bg-gray-100"
                              onClick={() => handleQuantityChange('item2', quantities.item2 - 1)}
                            >-</button>
                            <input 
                              type="text" 
                              value={quantities.item2} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) handleQuantityChange('item2', val);
                              }}
                              className="w-12 text-center border-x border-gray-300" 
                            />
                            <button 
                              className="px-3 py-1 bg-gray-100"
                              onClick={() => handleQuantityChange('item2', quantities.item2 + 1)}
                            >+</button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">$29.99</td>
                      <td className="p-4 text-right font-semibold">${(29.99 * quantities.item2).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button className="text-red-600 hover:text-red-800">Remove</button>
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                            <span className="text-2xl">🎁</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">Gift Box Premium</h3>
                            <p className="text-sm text-gray-600">Red</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <div className="flex border border-gray-300 rounded">
                            <button 
                              className="px-3 py-1 bg-gray-100"
                              onClick={() => handleQuantityChange('item3', quantities.item3 - 1)}
                            >-</button>
                            <input 
                              type="text" 
                              value={quantities.item3} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) handleQuantityChange('item3', val);
                              }}
                              className="w-12 text-center border-x border-gray-300" 
                            />
                            <button 
                              className="px-3 py-1 bg-gray-100"
                              onClick={() => handleQuantityChange('item3', quantities.item3 + 1)}
                            >+</button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">$19.99</td>
                      <td className="p-4 text-right font-semibold">${(19.99 * quantities.item3).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button className="text-red-600 hover:text-red-800">Remove</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </SelectableElement>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow mb-4">
              <h3 className="font-semibold mb-4">Apply Coupon Code</h3>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Enter coupon code" 
                  className="flex-grow border border-gray-300 rounded-l px-4 py-2"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r">
                  Apply
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Special Instructions</h3>
              <textarea 
                placeholder="Add notes about your order" 
                className="w-full border border-gray-300 rounded px-4 py-2 h-32"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <SelectableElement 
              elementType="Cart Summary" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'Cart Summary'}
            >
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${((199.99 * quantities.item1) + (29.99 * quantities.item2) + (19.99 * quantities.item3)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$9.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(((199.99 * quantities.item1) + (29.99 * quantities.item2) + (19.99 * quantities.item3)) * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(
                        (199.99 * quantities.item1) + 
                        (29.99 * quantities.item2) + 
                        (19.99 * quantities.item3) + 
                        9.99 + 
                        ((199.99 * quantities.item1) + (29.99 * quantities.item2) + (19.99 * quantities.item3)) * 0.08
                      ).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <SelectableElement 
                  elementType="Checkout Button" 
                  onSelect={handleElementSelect}
                  isSelected={selectedElement?.type === 'Checkout Button'}
                >
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold">
                    Proceed to Checkout
                  </button>
                </SelectableElement>
                
                <div className="mt-4 text-center">
                  <a href="#" className="text-red-600 hover:underline">Continue Shopping</a>
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