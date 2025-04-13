import { create } from 'zustand';

export type SelectedElement = {
  type: string;
  ref: HTMLElement | null;
  code?: string;
} | null;

interface EditorState {
  selectedElement: SelectedElement;
  isAIModalOpen: boolean;
  useMultimodalInput: boolean;
  isProcessing: boolean;
  lastModifiedElement: {
    type: string;
    originalCode: string;
    modifiedCode: string;
  } | null;
  setSelectedElement: (element: SelectedElement) => void;
  openAIModal: () => void;
  closeAIModal: () => void;
  toggleMultimodalInput: () => void;
  startProcessing: () => void;
  stopProcessing: () => void;
  setLastModifiedElement: (elementType: string, originalCode: string, modifiedCode: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedElement: null,
  isAIModalOpen: false,
  useMultimodalInput: true,
  isProcessing: false,
  lastModifiedElement: null,
  setSelectedElement: (element) => set({ selectedElement: element }),
  openAIModal: () => set({ isAIModalOpen: true }),
  closeAIModal: () => set({ isAIModalOpen: false }),
  toggleMultimodalInput: () => set((state) => ({ useMultimodalInput: !state.useMultimodalInput })),
  startProcessing: () => set({ isProcessing: true }),
  stopProcessing: () => set({ isProcessing: false }),
  setLastModifiedElement: (type, originalCode, modifiedCode) => set({
    lastModifiedElement: { type, originalCode, modifiedCode }
  }),
})); 