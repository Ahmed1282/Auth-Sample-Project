const express = require('express');
const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const cache = require('../middleware/cache');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/clear-cache/products', auth.AuthToken, auth.AuthRole(["SuperAdmin"]), async (req, res, next) => {
  try {
    await cache.clearCache('/api/products');
    res.status(OK).json({ status: OK, message: 'Cache cleared for /products' });
  } catch (error) {
    console.error('Error clearing cache for /products:', error);
    res.status(INTERNAL_SERVER_ERROR).json({ status: INTERNAL_SERVER_ERROR, error: 'Internal Server Error' });
  }
});

router.get('/clear-cache/products/category/:categoryId', auth.AuthToken, auth.AuthRole(["SuperAdmin"]), async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    await cache.clearCache(`/api/products/category/${categoryId}`);
    res.status(OK).json({ status: OK, message: `Cache cleared for /products/category/${categoryId}` });
  } catch (error) {
    console.error(`Error clearing cache for /products/category/${categoryId}:`, error);
    res.status(INTERNAL_SERVER_ERROR).json({ status: INTERNAL_SERVER_ERROR, error: 'Internal Server Error' });
  }
});

module.exports = router;
