const express = require('express');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/category',  auth.AuthToken, auth.AuthRole(["SuperAdmin"]), categoryController.createCategory);
router.get('/category/:id', auth.AuthToken,auth.AuthRole(["SuperAdmin"]), categoryController.getCategory);
router.get('/categories', auth.AuthToken, auth.AuthRole(["SuperAdmin"]), categoryController.getCategories); 
router.delete('/category/:id', auth.AuthToken, auth.AuthRole(["SuperAdmin"]), categoryController.deleteCategory);

module.exports = router;
