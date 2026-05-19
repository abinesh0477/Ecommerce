const Cart = require('../models/Cart');
const Product = require('../models/Product');


const calculateTotalPrice = (items) => {
  if (!items || !items.length) return 0;
  return items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

const addImageUrls = (items, req) => {
  if (!items || !items.length) return items;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return items.map(item => {
    const product = item.product;
    if (product && product.image && !product.image.startsWith('http')) {
      product.image = `${baseUrl}${product.image}`;
    }
    return item;
  });
};


const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }
    const items = addImageUrls(cart.items, req);
    const totalPrice = calculateTotalPrice(cart.items);
    res.json({ items, totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId).select('name price stock image');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    const items = addImageUrls(updatedCart.items, req);
    const totalPrice = calculateTotalPrice(updatedCart.items);
    res.json({ items, totalPrice });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: err.message });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    const items = addImageUrls(updatedCart.items, req);
    const totalPrice = calculateTotalPrice(updatedCart.items);
    res.json({ items, totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };