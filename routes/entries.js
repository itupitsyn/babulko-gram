const router = require('express').Router();
// const {
//   Entry,
//   User
// } = require('../db/models/');

router.get('/register', (req, res) => {
  res.render('entries/register');
})

router.get('/', (req, res) => {
  res.render('index');
})

router.post('/register', async (req, res) => {
  const user = await User.create(req.body);
  // req.session.userName = user.name;
  // req.session.userEmail = user.email;
  // req.session.userId = user.id;
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.render('entries/login');
})
router.post('/login', async(req,res) => {
  console.log('tut')
  const { email, password } = req.body;
  const user = await User.findOne( {where: {email: email}})
  if (user) {
    if(user.password === req.body.password) {
      // req.session.userName = user.name;
      // req.session.userEmail = user.email;
      // req.session.userId = user.id;
      res.redirect(`/`) // переходим на профиль
    } else {
      res.send ('Wrong password. Please try again');
    }      
    }
    res.redirect(`/entries/register`)

})


router.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/')
})

module.exports = router;
