'use client';

import { useState } from 'react';
import { usePageStore, PageType } from '../store/pageStore';

type RouteItem = {
  id: PageType;
  name: string;
  path: string;
  icon: string;
};

type LeftPaneProps = {
  isVisible: boolean;
};

export default function LeftPane({ isVisible }: LeftPaneProps) {
  const { activePage, setActivePage } = usePageStore();
  
  const [routes] = useState<RouteItem[]>([
    { id: 'home', name: 'Home', path: '/', icon: '🏠' },
    { id: 'shop', name: 'Shop', path: '/shop', icon: '🛒' },
    { id: 'product', name: 'Product', path: '/product', icon: '📦' },
    { id: 'cart', name: 'Cart', path: '/cart', icon: '🛍️' },
    { id: 'login', name: 'Login', path: '/login', icon: '🔑' },
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: '👤' },
  ]);

  return (
    <div className={`w-64 h-full bg-gray-100 border-r transition-all duration-300 overflow-hidden ${isVisible ? 'block' : 'hidden'}`}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Pages</h2>
        <div className="space-y-2">
          {routes.map((route) => (
            <div
              key={route.id}
              onClick={() => setActivePage(route.id)}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                activePage === route.id 
                  ? 'bg-blue-100 border border-blue-300' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-3">{route.icon}</span>
              <span>{route.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 