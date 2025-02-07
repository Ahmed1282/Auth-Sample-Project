const Product = require('../models/product');
const Category = require('../models/category'); 
const { param, query, check, validationResult } = require('express-validator');
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');

const createProduct = async (req, res) => {

  const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }     
  try {
    const { name, price, categoryId } = req.body;

    //check whether category have any entries
    const categoriesCount = await Category.count();
    if (categoriesCount === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No categories available. Please create a category first.' });
    }

    //check whether the catgory exits or not
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No such category exits' });
    }
    const product = await Product.create({ name, price, categoryId });
    res.status(StatusCodes.CREATED).json(product);

  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price} = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
    }
    product.name = name || product.name;
    product.price = price || product.price;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const startTime = new Date();
    const products = await Product.findAll();
    const endTime = new Date();
    const time = endTime - startTime;
    console.log(`WITHOUT CACHING Fetched total products: ${products.length} products in ${time}ms`);

    res.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};


const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Category not found' });
    }
    const startTime = new Date();
    const products = await Product.findAll({ where: { CategoryId: categoryId } });
    const endTime = new Date();
    const time = endTime - startTime; 

    // Log the time when data was fetched
    console.log(`WITHOUT CACHING Fetched products from category ${category.name} : ${products.length} products in ${time}ms`);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};


module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory
};
