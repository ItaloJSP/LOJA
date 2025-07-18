require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const sequelize = require('./config/database');
const User = require('./models/User'); // <- necessário aqui
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const bcrypt = require('bcrypt');

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3001;

if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error("PORT variable must be integer between 0 and 65535");
}

app.options('*', cors());

app.use(cors({
  origin: ['https://imperio-front-pi.vercel.app']
, // pode adicionar outros domínios aqui
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/ping', (req, res) => {
  res.json({ msg: 'pong' });
});




app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use(authRoutes);
app.use('/products', productRoutes);

sequelize.sync().then(async () => {
  console.log('Banco conectado e tabelas sincronizadas');

   const existing = await User.findOne({ where: { username: 'admin' } });
  if (!existing) {
    
   await User.create({
  username: 'Nara2002@@',
  password: 'Nara2002@@', // <-- direto, sem hash
  role: 'admin',
});

    console.log('Usuário admin criado com sucesso (admin / admin321)');
  } else {
    console.log('Usuário admin já existe.');
  }

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(console.error);
