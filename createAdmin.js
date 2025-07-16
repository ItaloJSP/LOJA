require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./src/config/database');
const User = require('./src/models/User');

async function createAdmin() {
  try {
    await sequelize.sync();

    const passwordHash = await bcrypt.hash('Nara2002', 10);

    const [admin, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password: passwordHash,
      }
    });

    if (created) {
      console.log('Usuário admin criado com sucesso!');
    } else {
      console.log('Usuário admin já existe.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    process.exit(1);
  }
}

createAdmin();
