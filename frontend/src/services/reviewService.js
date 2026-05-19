
const STORAGE_KEY = 'product_reviews';


const getLocalReviews = (productId) => {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return all[productId] || [];
};

const saveLocalReviews = (productId, reviews) => {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  all[productId] = reviews;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

const reviewService = {
  
  getProductReviews: async (productId) => {
    return getLocalReviews(productId);
  },


  addReview: async (productId, rating, comment) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const newReview = {
      _id: Date.now().toString(),
      user: { name: currentUser.name || 'Anonymous' },
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };
    const reviews = getLocalReviews(productId);
    reviews.unshift(newReview);
    saveLocalReviews(productId, reviews);
    return newReview;
  }
};

export default reviewService;