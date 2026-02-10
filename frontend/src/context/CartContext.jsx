// frontend/src/context/CartContext.jsx

import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      const priceValue = parseFloat(product.unit_price || product.price || product.precio || 0);
      
      if (exists) {
        return prev.map(p =>
          p.id === product.id 
          ? { ...p, quantity: p.quantity + 1 } 
          : p
        );
      }
      
      return [...prev, { 
        id: product.id, 
        name: product.nombre || product.name, 
        unit_price: priceValue, 
        image: product.image || product.imagen_principal || "/assets/images/logo.png",
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (id, removeAll = false) => {
    setCart(prev => {
      if (removeAll) return prev.filter(p => p.id !== id);
      
      return prev.map(p => {
        if (p.id === id) {
          return { ...p, quantity: p.quantity - 1 };
        }
        return p;
      }).filter(p => p.quantity > 0);
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => {
    const itemPrice = parseFloat(item.unit_price) || 0;
    return sum + (item.quantity * itemPrice);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        total, 
        cartCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}