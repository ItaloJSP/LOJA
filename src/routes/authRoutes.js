const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  console.log('Senha enviada:', password);
  console.log('Hash armazenado:', user.password);

  const validPassword = await bcrypt.compare(password, user.password);
  console.log('Senha válida?', validPassword);

  if (!validPassword) return res.status(400).json({ message: 'Senha incorreta' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
});


module.exports = router;
