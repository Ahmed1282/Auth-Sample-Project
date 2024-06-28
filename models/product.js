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
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

//For sequelize
Category.hasMany(Product, {foreignkey: 'categoryId'});
Product.belongsTo(Category, {foreignkey: 'categoryId'});

module.exports = Product;
