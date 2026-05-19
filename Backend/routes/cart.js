const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.put('/:productId', authMiddleware, updateCartItem);
router.delete('/:productId', authMiddleware, removeFromCart);

module.exports = router;