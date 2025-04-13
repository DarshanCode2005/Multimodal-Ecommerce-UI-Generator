'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useFileStore } from '../../store/fileStore';
import { componentToFileMap } from '../../services/componentSyncService';
import SelectableElement from '../SelectableElement';
import { renderJSXString } from '../../utils/jsxRenderer';

export default function DashboardPage() {
  const { selectedElement, setSelectedElement, openAIModal, lastModifiedElement } = useEditorStore();
  const { activeFileId, getFileContent } = useFileStore();
  const [dynamicContent, setDynamicContent] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'settings'>('profile');

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 15, 2023',
    avatar: '👤'
  };

  // Mock order data
  const orders = [
    { id: '#ORD-12345', date: 'May 15, 2023', status: 'Delivered', total: 129.99 },
    { id: '#ORD-12346', date: 'June 2, 2023', status: 'Shipped', total: 79.50 },
    { id: '#ORD-12347', date: 'June 20, 2023', status: 'Processing', total: 249.99 },
  ];

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
        elementType="DashboardHeader" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'DashboardHeader'}
      >
        {renderElement("DashboardHeader", (
          <header className="bg-white shadow-sm py-4 px-6 border-b">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-600">Account Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Welcome, {user.name}</span>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
              </div>
            </div>
          </header>
        ))}
      </SelectableElement>

      <div className="flex flex-col md:flex-row flex-1">
        <SelectableElement 
          elementType="DashboardSidebar" 
          onSelect={handleElementSelect}
          isSelected={selectedElement?.type === 'DashboardSidebar'}
        >
          {renderElement("DashboardSidebar", (
            <aside className="w-full md:w-64 bg-white border-r border-gray-200">
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center p-2 rounded-md text-left ${
                        activeTab === 'profile' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">👤</span>
                      <span>My Profile</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center p-2 rounded-md text-left ${
                        activeTab === 'orders' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">📦</span>
                      <span>My Orders</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      className={`w-full flex items-center p-2 rounded-md text-left ${
                        activeTab === 'wishlist' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">❤️</span>
                      <span>Wishlist</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center p-2 rounded-md text-left ${
                        activeTab === 'settings' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">⚙️</span>
                      <span>Account Settings</span>
                    </button>
                  </li>
                  <li className="pt-4 border-t mt-4">
                    <button 
                      className="w-full flex items-center p-2 rounded-md text-left text-red-600 hover:bg-red-50"
                    >
                      <span className="mr-3">🚪</span>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
          ))}
        </SelectableElement>

        <main className="flex-1 p-6">
          <SelectableElement 
            elementType="DashboardContent" 
            onSelect={handleElementSelect}
            isSelected={selectedElement?.type === 'DashboardContent'}
          >
            {renderElement("DashboardContent", (
              <div>
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-4 md:mb-0 md:mr-6">
                          {user.avatar}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{user.name}</h3>
                          <p className="text-gray-500">Member since {user.joinDate}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-gray-700">Account Information</h4>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="mb-2">
                              <span className="text-gray-500">Email: </span>
                              <span>{user.email}</span>
                            </p>
                            <p>
                              <span className="text-gray-500">Phone: </span>
                              <span>+1 (555) 123-4567</span>
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-gray-700">Shipping Address</h4>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="mb-1">123 Main Street</p>
                            <p className="mb-1">Apt 4B</p>
                            <p className="mb-1">New York, NY 10001</p>
                            <p>United States</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-3">
                          Edit Profile
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                    
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${order.status === 'Delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : order.status === 'Shipped' 
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${order.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="text-center py-10">
                        <div className="text-5xl mb-4">❤️</div>
                        <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-4">Browse our products and add your favorites to your wishlist</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                          Browse Products
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="orderUpdates" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="orderUpdates" className="ml-2 block text-sm text-gray-700">
                              Order updates and shipping notifications
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="promotions" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="promotions" className="ml-2 block text-sm text-gray-700">
                              Promotions and special offers
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="newsletter" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                              Weekly newsletter
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Password & Security</h3>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-3">
                          Change Password
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                          Enable Two-Factor Authentication
                        </button>
                      </div>
                      
                      <div className="border-t pt-6 mt-6">
                        <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                        <button className="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </SelectableElement>
        </main>
      </div>

      <SelectableElement 
        elementType="DashboardFooter" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'DashboardFooter'}
      >
        {renderElement("DashboardFooter", (
          <footer className="bg-white py-4 border-t">
            <div className="container mx-auto px-6 text-center text-sm text-gray-600">
              <p>© 2023 YourBrand, Inc. All rights reserved.</p>
              <div className="mt-2 flex justify-center space-x-4">
                <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900">Terms of Service</a>
                <a href="#" className="hover:text-gray-900">Contact Us</a>
              </div>
            </div>
          </footer>
        ))}
      </SelectableElement>
    </div>
  );
} 