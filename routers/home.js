const router = require('express').Router();
const crypto = require('crypto');
const { User } = require('../db/models');

const { checkUser, deepCheckUser } = require('../middlewares/allMiddleWares');

router.get('/register', (req, res) => {
  res.render('home/register');
});

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/register', async (req, res) => {
  const newUser = {};
  newUser.login = req.body.login;
  newUser.email = req.body.email;
  newUser.password = crypto
    .createHash('sha256')
    .update(req.body.password)
    .digest('hex');
  newUser.statusId = req.body.statusId;
  const createdUser = await User.create(newUser);

  req.session.userName = createdUser.login;
  req.session.userEmail = createdUser.email;
  req.session.userId = createdUser.id;
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
      res.send('Wrong password. Please try again');
    }
  } else {
    res.redirect('/home/register');
  }
});

router.get('/profile/:id', checkUser, deepCheckUser, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.render('userPage', { user }); // переходим на userPage.hbs
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
