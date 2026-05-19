import api from './api';

const cartService = {
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Get cart error:', error);
      return { items: [], totalPrice: 0 };
    }
  },

  addToCart: async (productId, quantity) => {
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
};

export default cartService;