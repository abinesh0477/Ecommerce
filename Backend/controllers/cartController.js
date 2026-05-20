const Cart = require('../models/Cart');
const Product = require('../models/Product');


const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

const formatItems = (items, req) => {
  if (!items || !items.length) return [];
  const baseUrl = getBaseUrl(req);
  return items.map((item) => {
   
    const itemObj   = item.toObject ? item.toObject() : { ...item };
    const productObj = itemObj.product;
    if (productObj && productObj.image && !productObj.image.startsWith('http')) {
      productObj.image = `${baseUrl}${productObj.image}`;
    }
    return itemObj;
  });
};

const calculateTotalPrice = (items) => {
  if (!items || !items.length) return 0;
  return items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

const buildCartResponse = (cart, req) => {
  const items      = formatItems(cart.items, req);
  const totalPrice = calculateTotalPrice(cart.items);
  return { items, totalPrice };
};


const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(buildCartResponse(cart, req));
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: err.message });
  }
};


const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }
    const qty = parseInt(quantity, 10);
    if (!qty || qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    
    if (product.stock < qty) {
      return res.status(400).json({ message: `Only ${product.stock} unit(s) available` });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(buildCartResponse(updatedCart, req));
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: err.message });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = parseInt(req.body.quantity, 10);

    if (!productId) return res.status(400).json({ message: 'Product ID required' });
    if (isNaN(quantity)) return res.status(400).json({ message: 'Valid quantity required' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(buildCartResponse(updatedCart, req));
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).json({ message: err.message });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const before = cart.items.length;
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    if (cart.items.length === before) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    res.json({ message: 'Item removed successfully' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };