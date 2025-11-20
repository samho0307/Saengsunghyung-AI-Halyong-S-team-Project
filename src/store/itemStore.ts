import { create } from 'zustand';

interface Item {
  id: string;
  type: 'hair' | 'outfit' | 'accessory' | 'background';
  name: string;
  price: number;
  owned: boolean;
}

interface ItemState {
  items: Item[];
  purchaseItem: (id: string) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  items: [
    { id: '1', type: 'hair', name: 'Short Hair', price: 0, owned: true },
    { id: '2', type: 'outfit', name: 'T-Shirt', price: 0, owned: true },
  ],
  purchaseItem: (id) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, owned: true } : item)
  })),
}));

