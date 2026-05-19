const Order = require('../models/Order');
const Product = require('../models/Product');

const addFullImageUrls = (order, req) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (order.products && order.products.length) {
    order.products = order.products.map(item => ({
      ...item.toObject(),
      product: item.product ? {
        ...item.product.toObject(),
        image: item.product.image ? `${baseUrl}${item.product.image}` : null
      } : null
    }));
  }
  return order;
};


const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({ message: 'No products in order' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Complete shipping address required' });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }

      totalAmount += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.id,
      products: orderProducts,
      totalAmount,
      shippingAddress
    });

    await order.save();
    
    await order.populate('products.product');
    const orderWithUrls = addFullImageUrls(order, req);
    
    res.status(201).json(orderWithUrls);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: err.message });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product', 'name image price')
      .sort({ createdAt: -1 });
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const ordersWithUrls = orders.map(order => addFullImageUrls(order, req));
    
    res.json(ordersWithUrls);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ message: err.message });
  }
};


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orderWithUrls = addFullImageUrls(order, req);
    res.json(orderWithUrls);
  } catch (err) {
    console.error('Get order by id error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { limit = 100, status, page = 1 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);
    const pages = Math.ceil(total / limitNum);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const ordersWithUrls = orders.map(order => addFullImageUrls(order, req));

    res.json({
      orders: ordersWithUrls,
      total,
      pages,
      currentPage: pageNum
    });
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ message: err.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    
    await order.populate('products.product');
    const orderWithUrls = addFullImageUrls(order, req);

    res.json(orderWithUrls);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: err.message });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

   
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};