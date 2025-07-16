const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const fs = require('fs');
const cloudinary = require('../config/cloudinary');




// GET produtos (aberto a qualquer usuário autenticado)
router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// POST adicionar produto (apenas admin)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {

console.log('REQ BODY:', req.body);
    console.log('REQ FILES:', req.files);
    
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Imagem é obrigatória' });

      
    }


    // Faz upload da imagem para Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.files.image.tempFilePath);

    // Remove arquivo temporário
    fs.unlinkSync(req.files.image.tempFilePath);

    const { name, description, category, sizes, stock } = req.body;
    const sizesArray = JSON.parse(sizes); // tamanho esperado como JSON string

    const product = await Product.create({
      name,
      description,
      category,
      sizes: sizesArray,
      stock,
      imageUrl: uploadResult.secure_url,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar produto' });
  }
});

module.exports = router;
