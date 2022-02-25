const router = require('express').Router();
const crypto = require('crypto');
const { User, Status } = require('../db/models');

router.get('/register', async (req, res) => {
  const status = await Status.findAll();
  res.render('home/register', { status });
});

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/register', async (req, res) => {
  const { login, email, name, statuses } = req.body;
  let password = crypto
    .createHash('sha256')
    .update(req.body.password)
    .digest('hex');
  if (statuses === '' && name === '') {
    res.render('error', {
      message:
        'Поле "статус" не может быть пустым. Пожалуйста, введите статус!',
    });
  }
  let user;
  if (statuses === '') {
    const status = await Status.create({ name });
    user = await User.create({ login, email, password, statusId: status.id });
  } else {
    const st = await Status.findOne({ where: { name: statuses } });
    user = await User.create({ login, email, password, statusId: st.id });
  }
  req.session.userName = user.login;
  req.session.userEmail = user.email;
  req.session.userId = user.id;
  res.redirect('/user'); // дописать ручку
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    if (
      user.password ===
      crypto.createHash('sha256').update(password).digest('hex')
    ) {
      req.session.userName = user.login;
      req.session.userEmail = user.email;
      req.session.userId = user.id;
      res.redirect('/user'); // дописать ручку
    } else {
      res.render('error', {
        message: 'Неправильный пароль. Пожалуйста, попробуйте еще раз!',
        error: {},
      });
    }
  } else {
    res.redirect('/home/register');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
