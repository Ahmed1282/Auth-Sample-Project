const express = require('express');
const productController = require('../controllers/productController');
const { param, query, check, validationResult } = require('express-validator');
const validator = require ('../middleware/validator')
const auth = require('../middleware/auth');


const router = express.Router();

// router.post('/products', productController.createProduct);
//ideally use method body as controller has req.body but check can also work 
router.post('/products', validator.validateProduct, auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"), productController.createProduct);

// router.get('/products/:id', productController.getProduct);
router.get('/products/:id', validator.validateProductId, productController.getProduct);

router.put('/products/:id', productController.updateProduct, auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"));
router.delete('/products/:id', productController.deleteProduct, auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"));
router.get('/products', productController.getAllProducts, auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"));

module.exports = router;
