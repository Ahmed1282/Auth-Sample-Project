const express = require('express');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/category', auth.AuthToken, auth.AuthRole, categoryController.createCategory);
router.get('/category/:id', auth.AuthToken, categoryController.getCategory);
router.delete('/category/:id', auth.AuthToken, auth.AuthRole, categoryController.deleteCategory);

module.exports = router;
