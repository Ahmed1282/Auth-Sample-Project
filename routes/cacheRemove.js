const express = require('express');
const cache = require('../middleware/cache');
const router = express.Router();

router.get('/clear-cache/products', async (req, res, next) => {
  try {
    await cache.clearCache('/api/products');
    res.status(200).json({ message: 'Cache cleared for /products' });
  } catch (error) {
    console.error('Error clearing cache for /products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/clear-cache/products/category/:categoryId', async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    await cache.clearCache(`/api/products/category/${categoryId}`);
    res.status(200).json({ message: `Cache cleared for /products/category/${categoryId}` });
  } catch (error) {
    console.error(`Error clearing cache for /products/category/${categoryId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
