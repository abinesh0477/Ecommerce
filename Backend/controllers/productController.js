const Product = require('../models/Product');


const addFullImageUrl = (product, req) => {
  if (!product) return product;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const obj = product.toObject ? product.toObject() : { ...product };
  if (obj.image && !obj.image.startsWith('http')) {
    obj.image = `${baseUrl}${obj.image}`;
  }
  return obj;
};


const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search)   query.name = { $regex: search.trim(), $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(query)
    ]);

    res.json({
      products: products.map((p) => addFullImageUrl(p, req)),
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: err.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(addFullImageUrl(product, req));
  } catch (err) {
    console.error('Get product by id error:', err);
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

   
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if (price === undefined || price === '') {
      return res.status(400).json({ message: 'Price is required' });
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ message: 'Category is required' });
    }

    const parsedStock = (stock !== undefined && stock !== '') ? parseInt(stock, 10) : 0;
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer' });
    }

    const product = new Product({
      name:        name.trim(),
      description: description ? description.trim() : '',
      price:       parsedPrice,
      category:    category.trim(),
      stock:       parsedStock,
      image:       req.file ? `/uploads/${req.file.filename}` : null
    });

    await product.save();
    res.status(201).json(addFullImageUrl(product, req));
  } catch (err) {
    console.error('Create product error:', err);
    res.status(400).json({ message: err.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, category, stock } = req.body;

    if (name !== undefined)        product.name        = name.trim();
 
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: 'Price must be a non-negative number' });
      }
      product.price = parsedPrice;
    }
    if (category !== undefined)    product.category    = category.trim();
    if (stock !== undefined && stock !== '') {
      const parsedStock = parseInt(stock, 10);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ message: 'Stock must be a non-negative integer' });
      }
      product.stock = parsedStock;
    }
    if (req.file) product.image = `/uploads/${req.file.filename}`;

    await product.save();
    res.json(addFullImageUrl(product, req));
  } catch (err) {
    console.error('Update product error:', err);
    res.status(400).json({ message: err.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: err.message });
  }
};


const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(products.map((p) => addFullImageUrl(p, req)));
  } catch (err) {
    console.error('Get products by category error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory };