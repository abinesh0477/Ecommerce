const router = require('express').Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/',              authMiddleware,                    createOrder);
router.get('/myorders',       authMiddleware,                    getUserOrders);
router.get('/admin',          authMiddleware, adminMiddleware,   getAllOrders);
router.put('/:id/status',     authMiddleware, adminMiddleware,   updateOrderStatus);
router.put('/:id/cancel',     authMiddleware,                    cancelOrder);
router.get('/:id',            authMiddleware,                    getOrderById);

module.exports = router;