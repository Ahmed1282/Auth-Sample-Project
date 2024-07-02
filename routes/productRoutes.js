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
router.get('/products/:id', validator.validateProductId, auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"), productController.getProduct);

router.put('/products/:id', auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"), productController.updateProduct );
router.delete('/products/:id', auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"), productController.deleteProduct);
router.get('/products', auth.AuthRole("SuperAdmin"), auth.AuthRole("Admin"), productController.getAllProducts);

module.exports = router;
