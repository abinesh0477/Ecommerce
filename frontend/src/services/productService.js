import api from './api';

const productService = {
  getProducts: async (filters = {}) => {
    // Remove empty/undefined filter values to keep the URL clean
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    );
    const params = new URLSearchParams(cleanFilters).toString();
    const url = `/products${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data; // { products, total, pages, currentPage }
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  // FIX: ProductForm already builds FormData and passes it here directly.
  // Accept either a plain object OR a FormData — handle both cases.
  createProduct: async (productData) => {
    let payload;

    if (productData instanceof FormData) {
      // Already FormData — use as-is (from ProductForm)
      payload = productData;
    } else {
      // Plain object — build FormData
      payload = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
    }

    const response = await api.post('/products', payload);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    let payload;

    if (productData instanceof FormData) {
      payload = productData;
    } else {
      payload = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
    }

    const response = await api.put(`/products/${id}`, payload);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;