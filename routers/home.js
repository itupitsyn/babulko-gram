const router = require('express').Router();
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
  const { login, email, password, name, statuses } = req.body;
  console.log(req.body);
  if (statuses === '' && name === '') {
    res.send ('Поле "статус" не может быть пустым. Пожалуйста, введите статус');
  };
  let user;
  if (statuses === '') {
    const status = await Status.create({name});
    user = await User.create( {login, email, password, statusId: status.id})
  } else { 
    let st = await Status.findOne({where: {name: statuses}})
    console.log(st)
    console.log(st.id)
    user = await User.create( {login, email, password, statusId: st.id })
  }
  req.session.userName = user.login;
  req.session.userEmail = user.email;
  req.session.userId = user.id;
  res.redirect('/user') // дописать ручку
})

router.post('/', async(req,res) => {
  const { email, password } = req.body;
  const user = await User.findOne( {where: {email: email}})
  if (user) {
    if(user.password === req.body.password) {
      req.session.userName = user.login;
      req.session.userEmail = user.email;
      req.session.userId = user.id;
      res.redirect('/user') // дописать ручку
    } else {
      res.send ('Wrong password. Please try again');
    }
  } else {
    res.redirect(`/home/register`);
  }

})

router.get('/', (req,res) => {
  const { statusFromUser } = req.body;
  const status = Status.findOne({ where: {status} })
})

router.get('/user', checkUser, deepCheckUser, async (req,res) => {
  const user = await User.findByPk(req.params.id);
  res.render('/user', {user}); // переходим на user.hbs

})

router.get('/user', (req, res) => {
  res.redirect('/home/user');
})


router.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/')
})

module.exports = router;
