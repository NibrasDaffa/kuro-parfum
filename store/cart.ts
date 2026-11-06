"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  volumeMl: number;
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

const limit = (quantity: number, stock: number) => Math.max(1, Math.min(10, stock, quantity));

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((entry) => entry.productId === item.productId);
        if (existing) {
          set({
            isOpen: true,
            items: items.map((entry) =>
              entry.productId === item.productId
                ? { ...entry, ...item, quantity: limit(entry.quantity + quantity, item.stock) }
                : entry,
            ),
          });
          return;
        }
        set({
          isOpen: true,
          items: [...items, { ...item, quantity: limit(quantity, item.stock) }],
        });
      },
      setQuantity: (productId, quantity) => {
        const current = get().items.find((entry) => entry.productId === productId);
        if (!current) return;
        if (quantity < 1) {
          set({ items: get().items.filter((entry) => entry.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((entry) =>
            entry.productId === productId
              ? { ...entry, quantity: limit(quantity, entry.stock || 10) }
              : entry,
          ),
        });
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((entry) => entry.productId !== productId) }),
      clear: () => set({ items: [], isOpen: false }),
    }),
    {
      name: "kuro-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
