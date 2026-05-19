// src/services/wishlistService.js - LocalStorage only (no API calls)
const STORAGE_KEY = 'wishlist';

const wishlistService = {
  // Get wishlist from localStorage
  getWishlist: async () => {
    const local = localStorage.getItem(STORAGE_KEY);
    return local ? JSON.parse(local) : [];
  },

  // Add product to wishlist (store product object)
  addToWishlist: async (product) => {
    const current = await wishlistService.getWishlist();
    if (!current.some(p => p._id === product._id)) {
      current.push(product);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
    return { success: true };
  },

  // Remove product by ID
  removeFromWishlist: async (productId) => {
    let current = await wishlistService.getWishlist();
    current = current.filter(p => p._id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return { success: true };
  }
};

export default wishlistService;