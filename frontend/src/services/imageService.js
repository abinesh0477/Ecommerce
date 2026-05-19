// src/services/imageService.js
// Backend already returns full URLs like http://localhost:5000/uploads/xxx.jpg
// So we just use them directly.

export const getProductImage = (product) => {
  // If product has a valid image URL (full URL from backend)
  if (product?.image && typeof product.image === 'string') {
    // If it's already an absolute URL, use it
    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
      return product.image;
    }
    // If it's a relative path (fallback), prepend backend base URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const baseURL = API_URL.replace('/api', '');
    return `${baseURL}${product.image}`;
  }
  
  // Category-based fallback images (when backend returns no image)
  const fallbacks = {
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
    'Clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
    'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop',
    'Home & Garden': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
    'Toys': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
    'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    'Automotive': 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop'
  };
  
  if (product?.category && fallbacks[product.category]) {
    return fallbacks[product.category];
  }
  
 
  const productName = encodeURIComponent(product?.name || 'Product');
  return `https://placehold.co/400x400/4f46e5/white?text=${productName.substring(0, 15)}`;
};

export const handleImageError = (e, product) => {
  e.target.src = getFallbackImage(product);
};

export const getFallbackImage = (product) => {
  return getProductImage({ ...product, image: null });
};