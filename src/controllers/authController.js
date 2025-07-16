exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    console.log('Usuário não encontrado:', username);
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log('Senha incorreta para usuário:', username);
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }

  console.log('Login bem-sucedido:', username);
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};
