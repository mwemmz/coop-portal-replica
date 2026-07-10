"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  listingId: string;
  name: string;
  price: number;
  quantityKg: number;
  grade: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, qty: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("coop-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("coop-cart", JSON.stringify(items));
  }, [items, loaded]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.listingId === item.listingId);
      if (existing) {
        return prev.map((i) =>
          i.listingId === item.listingId ? { ...i, quantityKg: i.quantityKg + item.quantityKg } : i
        );
      }
      return [...prev, item];
    });
  }

  function removeItem(listingId: string) {
    setItems((prev) => prev.filter((i) => i.listingId !== listingId));
  }

  function updateQuantity(listingId: string, qty: number) {
    if (qty <= 0) { removeItem(listingId); return; }
    setItems((prev) => prev.map((i) => (i.listingId === listingId ? { ...i, quantityKg: qty } : i)));
  }

  function clearCart() { setItems([]); }

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantityKg, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantityKg, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
