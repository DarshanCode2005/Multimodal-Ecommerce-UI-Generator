import { create } from 'zustand';

export type PageType = 'home' | 'shop' | 'product' | 'cart' | 'login' | 'dashboard' | 'confirmation' | 'search';

interface PageState {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const usePageStore = create<PageState>((set) => ({
  activePage: 'home',
  setActivePage: (page) => set({ activePage: page }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
})); 