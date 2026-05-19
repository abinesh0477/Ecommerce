import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import wishlistService from '../services/wishlistService';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    const data = await wishlistService.getWishlist();
    setWishlist(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist, user]);

  const addToWishlist = async (product) => {
    await wishlistService.addToWishlist(product);
    setWishlist(prev => {
      if (prev.some(p => p._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = async (productId) => {
    await wishlistService.removeFromWishlist(productId);
    setWishlist(prev => prev.filter(p => p._id !== productId));
  };

  const isInWishlist = (productId) => wishlist.some(p => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};