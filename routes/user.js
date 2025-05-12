const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

// Public routes
router.post('/login', userController.loginUser);
router.post('/', userController.createUser);

// Protected routes
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router; 