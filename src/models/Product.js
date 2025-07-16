const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  sizes: DataTypes.ARRAY(DataTypes.STRING), // array de strings
  stock: DataTypes.INTEGER,
  imageUrl: DataTypes.STRING, // url da imagem (ex: da nuvem)
});

module.exports = Product;
