const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/db');  // Import sequelize instance
const User = require('./models/user');  // Import User model
const Product = require('./models/product');  // Import Product model
const productRoutes = require('./routes/productRoutes');
const Category = require('./models/category');  
const categoryRoutes = require('./routes/categoryRoutes');
const cacheRemove = require('./routes/cacheRemove')
require('dotenv').config();


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cacheRemove);



const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB Connection has been established successfully.');

    // // Synchronize models
    //  await sequelize.sync({ force: true }); // Use force: true to drop and recreate tables
    //  console.log('All models were synchronized successfully.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
