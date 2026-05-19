
const router = require('express').Router();
const { 
  register, 
  login, 
  getMe, 
  getAllUsers,
  updateProfile,
  changePassword 
} = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');


console.log('Auth routes loaded:', {
  register: typeof register,
  login: typeof login,
  getMe: typeof getMe,
  getAllUsers: typeof getAllUsers,
  updateProfile: typeof updateProfile,
  changePassword: typeof changePassword
});


router.post('/register', register);
router.post('/login', login);


router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);


router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;