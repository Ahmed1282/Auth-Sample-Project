const express = require('express');
const userController = require('../controllers/userController');
const validator = require ('../middleware/validator')


const router = express.Router();

router.post('/signup', validator.validateUserCreation, userController.createUser);
router.post('/login', userController.loginUser);
router.get('/users/:id', userController.getUser);
router.put('/users/:id', validator.validateUserUpdate, userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users', userController.getAllUsers);

module.exports = router;
