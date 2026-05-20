// Wishlist is stored locally (no backend endpoint).
const STORAGE_KEY = 'ecom_wishlist';

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const write = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save wishlist:', err);
  }
};

const wishlistService = {
  getWishlist: async () => read(),

  addToWishlist: async (product) => {
    if (!product?._id) throw new Error('Invalid product');
    const current = read();
    if (!current.some((p) => p._id === product._id)) {
      current.push(product);
      write(current);
    }
    return { success: true };
  },

  removeFromWishlist: async (productId) => {
    if (!productId) throw new Error('productId is required');
    const current = read().filter((p) => p._id !== productId);
    write(current);
    return { success: true };
  },

  isInWishlist: (productId) => {
    return read().some((p) => p._id === productId);
  },

  clearWishlist: async () => {
    write([]);
    return { success: true };
  },
};

export default wishlistService;