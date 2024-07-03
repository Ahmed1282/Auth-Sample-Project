const Category = require('../models/category');
const Product = require('../models/product');
const sequelize = require('../config/db');

const populateDatabase = async () => {
  try {
    const createdCategories = [];
    for (let i = 1; i <= 10; i++) {
      const categoryName = `Cat${i}`;
      const createdCategory = await Category.create({ name: categoryName });
      console.log(`Created category: ${createdCategory.name}`);
      createdCategories.push(createdCategory);
    }

    let productId = 1; 
    for (let category of createdCategories) {
      const createdProducts = [];
      for (let j = 1; j <= 100; j++) {
        const productName = `Prod${productId}`;
        const productPrice = getRandomPrice(); 
        const createdProduct = await Product.create({
          name: productName,
          price: productPrice,
          CategoryId: category.id
        });
        console.log(`Created product: ${createdProduct.name} in category: ${category.name}`);
        createdProducts.push(createdProduct);
        productId++;
      }
      console.log(`Created ${createdProducts.length} products for category: ${category.name}`);
    }

    console.log('Database population completed successfully.');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await sequelize.close();
  }
};


const getRandomPrice = () => {
  return (Math.random() * (100 - 1) + 1).toFixed(2); 
};

populateDatabase();
