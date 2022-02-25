const router = require('express').Router();
const crypto = require('crypto');
const { User, Status } = require('../db/models');

const { checkUser, deepCheckUser } = require('../middlewares/allMiddleWares');

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
    res.send('Поле "статус" не может быть пустым. Пожалуйста, введите статус');
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
      res.send('Неправильный пароль. Пожалуйста, попррбуйте еще раз!');
    }
  } else {
    res.redirect('/home/register');
  }
});

router.get('/', (req, res) => {
  const { statusFromUser } = req.body;
  const status = Status.findOne({ where: { status } });
});

router.get('/user', checkUser, deepCheckUser, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.render('/user', { user }); // переходим на user.hbs
});

// router.get('/user', (req, res) => {
//   res.redirect('/home/user');
// })

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
