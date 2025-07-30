import { create } from 'zustand';

interface ImageState {
  image: string | null;
  setImage: (uri: string) => void;
  clearImage: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  image: null,
  setImage: (uri: string) => set({ image: uri }),
  clearImage: () => set({ image: null }),
}));