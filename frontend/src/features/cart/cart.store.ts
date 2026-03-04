import { create } from "zustand";

type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (product_id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.product_id === item.product_id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  remove: (product_id) => set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) })),
  clear: () => set({ items: [] })
}));
