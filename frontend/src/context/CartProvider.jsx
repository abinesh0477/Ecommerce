import React, { createContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId, quantity) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }
    try {
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      const updatedCart = await cartService.updateCartItem(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  const removeItem = async (productId) => {
    if (!user) return;
    try {
      await cartService.removeFromCart(productId);
      await loadCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = () => {
    setCart({ items: [], totalPrice: 0 });
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      loadCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};