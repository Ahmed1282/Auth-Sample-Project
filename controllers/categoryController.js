const Category = require('../models/category');
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    //checking whether catergory has unique name 
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Category name already exists' });
    }

    const category = await Category.create({ name });
    res.status(StatusCodes.CREATED).json(category);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id); // Use findByPk instead of findByPK
    if (!category) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id); 
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Category not found' });
      }
      await category.destroy();
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };

  const getCategories = async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  getCategories
};
