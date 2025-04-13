import { create } from 'zustand';

export type PageType = 'home' | 'shop' | 'product' | 'cart';

interface PageState {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
}

export const usePageStore = create<PageState>((set) => ({
  activePage: 'home',
  setActivePage: (page) => set({ activePage: page }),
})); 