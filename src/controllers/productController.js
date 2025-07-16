const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, sizes, stock } = req.body;
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Imagem é obrigatória' });
    }

    const file = req.files.image;

    // Upload para Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'imperiomoda',
    });

    const newProduct = await Product.create({
      name,
      description,
      sizes: sizes.split(',').map((s) => s.trim()),
      stock,
      imageUrl: result.secure_url,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
};
