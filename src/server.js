require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const sequelize = require('./config/database');
const User = require('./models/User'); // <- necessário aqui
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use(authRoutes);
app.use('/products', productRoutes);

sequelize.sync().then(async () => {
  console.log('Banco conectado e tabelas sincronizadas');

   const existing = await User.findOne({ where: { username: 'admin' } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Usuário admin criado com sucesso (admin / admin123)');
  } else {
    console.log('Usuário admin já existe.');
  }

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(console.error);
