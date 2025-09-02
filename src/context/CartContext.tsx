import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, personalization?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

const STORAGE_KEY = 'merch_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function makeItemId(productId: string, personalization?: string) {

    return `${productId}::${(personalization || '').slice(0, 100)}`;
  }

  const addToCart = (product: Product, quantity = 1, personalization?: string) => {
    setItems((prev) => {
      const id = makeItemId(product.id, personalization);
      const found = prev.find((p) => p.id === id);
      if (found) {
        return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + quantity } : p));
      }
      const newItem: CartItem = {
        id,
        productId: product.id,
        title: product.title + (personalization ? ` — "${personalization}"` : ''),
        price: product.price,
        quantity,
        personalization,
        image: product.image,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p)));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
