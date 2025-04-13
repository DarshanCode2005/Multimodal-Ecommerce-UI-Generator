'use client';

import { usePageStore, PageType } from '../store/pageStore';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AIInputModal from './AIInputModal';
import AIMultimodalInputModal from './AIMultimodalInputModal';
import { useEditorStore } from '../store/editorStore';

type PageRendererProps = {
  expanded: boolean;
};

export default function PageRenderer({ expanded }: PageRendererProps) {
  const { activePage } = usePageStore();
  const { useMultimodalInput } = useEditorStore();
  
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductPage />;
      case 'cart':
        return <CartPage />;
      case 'login':
        return <LoginPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <div className="flex-1 h-full overflow-auto">
        {renderActivePage()}
      </div>
      {useMultimodalInput ? <AIMultimodalInputModal /> : <AIInputModal />}
    </>
  );
} 