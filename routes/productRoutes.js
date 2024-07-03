const express = require('express');
const productController = require('../controllers/productController');
const { param, query, check, validationResult } = require('express-validator');
const validator = require ('../middleware/validator')
const auth = require('../middleware/auth');
const User = require('../models/user');
const cache = require('../middleware/cache')


const router = express.Router();

// router.post('/products', productController.createProduct);
//ideally use method body as controller has req.body but check can also work 
router.post('/products', validator.validateProduct, auth.AuthToken, auth.AuthRole(["SuperAdmin","Admin"]), productController.createProduct);

// router.get('/products/:id', productController.getProduct);
router.get('/products/:id', validator.validateProductId, auth.AuthToken, auth.AuthRole(["SuperAdmin","Admin"]), productController.getProduct);

router.put('/products/:id', auth.AuthToken, auth.AuthRole(["SuperAdmin","Admin"]), productController.updateProduct );
router.delete('/products/:id', auth.AuthToken, auth.AuthRole(["SuperAdmin","Admin"]), productController.deleteProduct);
// router.get('/products', auth.AuthToken, auth.AuthRole(["SuperAdmin","Admin"]), productController.getAllProducts);
// router.get('/products/category/:categoryId', auth.AuthToken, auth.AuthRole(["SuperAdmin","Admin"]), productController.getProductsByCategory);
//cache.createCache(600)
router.get('/products', auth.AuthToken, auth.AuthRole(["SuperAdmin", "Admin"]), cache.createCache(600), productController.getAllProducts);
router.get('/products/category/:categoryId', auth.AuthToken, auth.AuthRole(["SuperAdmin", "Admin"]), cache.createCache(600), productController.getProductsByCategory);

module.exports = router;
