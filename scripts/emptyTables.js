// emptyTables.js

const sequelize = require('../config/db');
const Category = require('../models/category');
const Product = require('../models/product');

const emptyTables = async () => {
  try {
    // await sequelize.authenticate(); // Ensure database connection is established
    // console.log('Database connection has been established successfully.');

    await Product.sync({ force: true });
    console.log('Product table dropped and recreated successfully.');

    await Category.sync({ force: true });
    console.log('Category table dropped and recreated successfully.');

    console.log('Tables dropped and recreated successfully.');

  } catch (error) {
    console.error('Error establishing database connection:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection has been closed.');
  }
};

// Run the script
emptyTables();
