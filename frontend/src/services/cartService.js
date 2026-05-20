import api from './api';

const cartService = {
  // FIX: Don't silently swallow errors — let the caller decide how to handle them.
  // Return empty cart only for 404 (cart doesn't exist yet), throw everything else.
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data; // { items, totalPrice }
    } catch (error) {
      if (error.response?.status === 404) {
        return { items: [], totalPrice: 0 };
      }
      throw error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  // Convenience: clear all items by removing each one
  clearCart: async (items = []) => {
    await Promise.all(items.map((item) => cartService.removeFromCart(item.product._id)));
  },
};

export default cartService;