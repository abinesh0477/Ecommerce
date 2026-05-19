
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { formatCurrency } from '../utils/formatCurrency';
import productService from '../../services/productService';
import reviewService from '../../services/reviewService';
import { getProductImage, handleImageError } from '../../services/imageService';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getProductReviews(id);
      setReviews(data);
    } catch (err) {
   
      console.error('Review fetch issue:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = () => {
    if (!user) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Login to review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.addReview(id, rating, comment);
      toast.success('Review added');
      setRating(0);
      setComment('');
      fetchReviews(); 
    } catch (err) {
      toast.error('Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-96 object-cover"
              onError={(e) => handleImageError(e, product)}
            />
          </div>
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2 dark:text-white">{product.name}</h1>
              <button onClick={toggleWishlist} className="text-red-500 hover:scale-110 transition">
                {isInWishlist(product._id) ? <HeartSolid className="h-6 w-6" /> : <HeartOutline className="h-6 w-6" />}
              </button>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500">★ {avgRating}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">({reviews.length} reviews)</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
            <div className="mb-4">
              <span className="text-gray-500 dark:text-gray-400">Category: </span>
              <span className="font-semibold dark:text-white">{product.category}</span>
            </div>
            <div className="mb-4">
              <span className="text-gray-500 dark:text-gray-400">Stock: </span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
              </span>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(product.price)}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">-</button>
                  <span className="w-16 text-center text-lg font-semibold dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">+</button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="w-full py-3 rounded-lg font-semibold transition bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {adding ? 'Adding...' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
            </button>
          </div>
        </div>
      </div>

      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Customer Reviews</h2>
        {user && (
          <form onSubmit={handleSubmitReview} className="mb-6 border-b dark:border-gray-700 pb-4">
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map(star => (
                <button type="button" key={star} onClick={() => setRating(star)}>
                  {star <= rating ? <StarSolid className="h-6 w-6 text-yellow-500" /> : <StarOutline className="h-6 w-6 text-gray-400" />}
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="3" className="w-full input rounded-md p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Write your review..."></textarea>
            <button type="submit" disabled={submitting} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="border-b dark:border-gray-700 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold dark:text-white">{review.user?.name}</span>
                <span className="text-yellow-500">★ {review.rating}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
              <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetail;