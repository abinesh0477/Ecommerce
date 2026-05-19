const Product = require('../models/Product');

// Helper to add full image URL
const addFullImageUrl = (product, req) => {
  if (!product) return product;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return {
    ...product.toObject(),
    image: product.image ? `${baseUrl}${product.image}` : null
  };
};

// @desc    Get products with filtering & pagination
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / limitNum);

    const productsWithUrls = products.map(p => addFullImageUrl(p, req));
    res.json({ products: productsWithUrls, total, pages, currentPage: pageNum });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(addFullImageUrl(product, req));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new product (Admin only)
const createProduct = async (req, res) => {
  try {
    console.log('📦 Received body:', req.body);
    console.log('📁 Received file:', req.file);

    const { name, description, price, category, stock } = req.body;

    // --- Validation ---
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if (!price) {
      return res.status(400).json({ message: 'Price is required' });
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ message: 'Category is required' });
    }

    const productData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      price: parsedPrice,
      category: category.trim(),
      stock: stock !== undefined && stock !== '' ? parseInt(stock, 10) : 0,
      image: req.file ? `/uploads/${req.file.filename}` : null
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json(addFullImageUrl(product, req));
  } catch (err) {
    console.error('❌ Create product error:', err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, category, stock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined && stock !== '') product.stock = parseInt(stock, 10);
    if (req.file) product.image = `/uploads/${req.file.filename}`;

    await product.save();
    res.json(addFullImageUrl(product, req));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    const productsWithUrls = products.map(p => addFullImageUrl(p, req));
    res.json(productsWithUrls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};