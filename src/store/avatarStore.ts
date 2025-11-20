import { create } from 'zustand';

interface AvatarState {
  isCreated: boolean;
  skinColor: string;
  hairStyle: string;
  outfit: string;
  generatedAvatarUrl: string | null; // Store the generated image URL
  setCreated: (status: boolean) => void;
  setSkinColor: (color: string) => void;
  setHairStyle: (style: string) => void;
  setOutfit: (outfit: string) => void;
  setGeneratedAvatarUrl: (url: string | null) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  isCreated: false,
  skinColor: '#F0D5B1',
  hairStyle: 'default',
  outfit: 'casual',
  generatedAvatarUrl: null,
  setCreated: (status) => set({ isCreated: status }),
  setSkinColor: (color) => set({ skinColor: color }),
  setHairStyle: (style) => set({ hairStyle: style }),
  setOutfit: (outfit) => set({ outfit }),
  setGeneratedAvatarUrl: (url) => set({ generatedAvatarUrl: url }),
}));
