const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Category = require('../models/category');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  }
}, {
  timestamps: true
});


//For sequelize

Product.belongsTo(Category, {foreignkey: 'CategoryId'});
//Category.hasMany(Product, {foreignkey: 'categoryId'});


module.exports = Product;
