// Reviews are stored locally (no backend endpoint).
// Storage key is namespaced per product to avoid collisions.

const STORAGE_KEY = 'ecom_product_reviews';

const getAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveAll = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save reviews to localStorage:', err);
  }
};

const reviewService = {
  getProductReviews: async (productId) => {
    if (!productId) return [];
    const all = getAll();
    return all[productId] || [];
  },

  addReview: async (productId, rating, comment) => {
    if (!productId) throw new Error('productId is required');
    if (!rating || rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');

    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    } catch { /* ignore parse errors */ }

    const newReview = {
      _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      user: { name: currentUser?.name || 'Anonymous' },
      rating: Number(rating),
      comment: (comment || '').trim(),
      createdAt: new Date().toISOString(),
    };

    const all = getAll();
    const reviews = all[productId] || [];
    reviews.unshift(newReview);
    all[productId] = reviews;
    saveAll(all);

    return newReview;
  },

  deleteReview: async (productId, reviewId) => {
    if (!productId || !reviewId) return;
    const all = getAll();
    if (all[productId]) {
      all[productId] = all[productId].filter((r) => r._id !== reviewId);
      saveAll(all);
    }
  },
};

export default reviewService;