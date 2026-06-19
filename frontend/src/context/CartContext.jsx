import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("apex_cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("apex_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (service) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.service_slug === service.slug);
      if (existing) {
        return prev.map((i) =>
          i.service_slug === service.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          service_slug: service.slug,
          title: service.title,
          category: service.category,
          price_from: service.price_from || 0,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (slug) => setItems((prev) => prev.filter((i) => i.service_slug !== slug));

  const setQuantity = (slug, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.service_slug === slug ? { ...i, quantity: Math.max(1, qty) } : i))
    );

  const clearCart = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const estTotal = items.reduce((s, i) => s + (i.price_from || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clearCart, count, estTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
