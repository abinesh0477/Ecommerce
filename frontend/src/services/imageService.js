// Resolve the backend base URL (strips /api suffix if present)
const getBackendBase = () => {
  try {
    const url = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';
    return url.replace(/\/api\/?$/, '');
  } catch {
    return 'http://localhost:5000';
  }
};

const BACKEND_BASE = getBackendBase();


const CATEGORY_FALLBACKS = {
  Electronics:   'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
  Clothing:      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
  Books:         'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop',
  'Home & Garden': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop',
  Sports:        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
  Toys:          'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
  Beauty:        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  Automotive:    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop',
};



export const getProductImage = (product) => {
  if (product?.image && typeof product.image === 'string') {
  
    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
      return product.image;
    }
    // Relative path fallback (shouldn't happen with fixed backend, but just in case)
    return `${BACKEND_BASE}${product.image}`;
  }

  // Category fallback
  if (product?.category && CATEGORY_FALLBACKS[product.category]) {
    return CATEGORY_FALLBACKS[product.category];
  }

  // Generic placeholder
  const label = encodeURIComponent((product?.name || 'Product').substring(0, 15));
  return `https://placehold.co/400x400/4f46e5/white?text=${label}`;
};

export const handleImageError = (e, product) => {

  e.target.onerror = null;
  e.target.src = getFallbackImage(product);
};


export const getFallbackImage = (product) => {
  return getProductImage({ ...product, image: null });
};