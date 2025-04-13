'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useFileStore } from '../../store/fileStore';
import { componentToFileMap } from '../../services/componentSyncService';
import SelectableElement from '../SelectableElement';
import { renderJSXString } from '../../utils/jsxRenderer';

export default function ConfirmationPage() {
  const { selectedElement, setSelectedElement, openAIModal, lastModifiedElement } = useEditorStore();
  const { activeFileId, getFileContent } = useFileStore();
  const [dynamicContent, setDynamicContent] = useState<{[key: string]: string}>({});

  // Mock order data
  const orderDetails = {
    orderId: '#ORD-12389',
    orderDate: 'July 15, 2023',
    items: [
      { id: 1, name: 'Premium Wireless Headphones', price: 149.99, quantity: 1, image: '🎧' },
      { id: 2, name: 'Smart Watch - Black', price: 199.99, quantity: 1, image: '⌚' },
      { id: 3, name: 'USB-C Charging Cable (2m)', price: 12.99, quantity: 2, image: '🔌' }
    ],
    subtotal: 375.96,
    shipping: 9.99,
    tax: 30.80,
    total: 416.75,
    paymentMethod: 'Credit Card (**** 4321)',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    estimatedDelivery: {
      startDate: 'July 20, 2023',
      endDate: 'July 23, 2023'
    }
  };

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SelectableElement 
        elementType="ConfirmationHeader" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'ConfirmationHeader'}
      >
        {renderElement("ConfirmationHeader", (
          <header className="bg-white shadow-sm py-4 px-6 border-b">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-600">Order Confirmation</h1>
              <div className="text-sm text-gray-500">
                Order ID: {orderDetails.orderId}
              </div>
            </div>
          </header>
        ))}
      </SelectableElement>

      <main className="flex-1 container mx-auto px-4 py-8">
        <SelectableElement 
          elementType="ThankYouMessage" 
          onSelect={handleElementSelect}
          isSelected={selectedElement?.type === 'ThankYouMessage'}
        >
          {renderElement("ThankYouMessage", (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
              <div className="text-5xl mb-4 text-green-500">✅</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h2>
              <p className="text-gray-600 text-lg mb-6">
                Your order has been received and is being processed.
              </p>
              <p className="text-gray-600 mb-4">
                A confirmation email has been sent to your registered email address.
              </p>
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium mr-4">
                  View Order Status
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium">
                  Continue Shopping
                </button>
              </div>
            </div>
          ))}
        </SelectableElement>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SelectableElement 
              elementType="OrderDetails" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'OrderDetails'}
            >
              {renderElement("OrderDetails", (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Order Details</h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{orderDetails.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{orderDetails.paymentMethod}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Items</h4>
                    <div className="space-y-4">
                      {orderDetails.items.map(item => (
                        <div key={item.id} className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-2xl mr-4">
                            {item.image}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${orderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping:</span>
                      <span>${orderDetails.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax:</span>
                      <span>${orderDetails.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </SelectableElement>
          </div>
          
          <div>
            <SelectableElement 
              elementType="DeliveryInfo" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'DeliveryInfo'}
            >
              {renderElement("DeliveryInfo", (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Delivery Information</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Estimated Delivery</h4>
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-center">
                      <span className="text-3xl mr-3">🚚</span>
                      <div>
                        <p className="font-medium text-blue-800">
                          {orderDetails.estimatedDelivery.startDate} - {orderDetails.estimatedDelivery.endDate}
                        </p>
                        <p className="text-sm text-blue-600">Standard Shipping (3-5 business days)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                      <p>{orderDetails.shippingAddress.street}</p>
                      <p>
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
                      </p>
                      <p>{orderDetails.shippingAddress.country}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center justify-center">
                      <span className="mr-2">📍</span>
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </SelectableElement>
            
            <SelectableElement 
              elementType="CustomerSupport" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'CustomerSupport'}
            >
              {renderElement("CustomerSupport", (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about your order, please contact our customer support team.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📧</span>
                      <span>support@example.com</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📞</span>
                      <span>1-800-123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💬</span>
                      <span>Live Chat (9am - 6pm EST)</span>
                    </div>
                  </div>
                </div>
              ))}
            </SelectableElement>
          </div>
        </div>
      </main>

      <SelectableElement 
        elementType="ConfirmationFooter" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'ConfirmationFooter'}
      >
        {renderElement("ConfirmationFooter", (
          <footer className="bg-white py-4 border-t mt-8">
            <div className="container mx-auto px-6 text-center text-sm text-gray-600">
              <p>© 2023 YourBrand, Inc. All rights reserved.</p>
              <div className="mt-2 flex justify-center space-x-4">
                <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900">Terms of Service</a>
                <a href="#" className="hover:text-gray-900">Returns & Refunds</a>
                <a href="#" className="hover:text-gray-900">Contact Us</a>
              </div>
            </div>
          </footer>
        ))}
      </SelectableElement>
    </div>
  );
} 