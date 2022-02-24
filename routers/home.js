const router = require('express').Router();
const { User } = require('../db/models/');

const { checkUser, deepCheckUser } = require('../middlewares/allMiddleWares');

router.get('/register', (req, res) => {
  res.render('home/register');
});

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/register', async (req, res) => {
  const user = await User.create(req.body);
  req.session.userName = user.login;
  req.session.userEmail = user.email;
  req.session.userId = user.id;
  res.redirect('/user'); // дописать ручку
});

router.post('/', async (req, res) => {
  console.log('tut');
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    if (user.password === req.body.password) {
      req.session.userName = user.login;
      req.session.userEmail = user.email;
      req.session.userId = user.id;
      res.redirect('/user'); // дописать ручку
    } else {
      res.send('Wrong password. Please try again');
    }
  } else {
    res.redirect(`/home/register`);
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
