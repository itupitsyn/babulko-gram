const router = require('express').Router();

router.get('/', (req, res) => {
  res.redirect('/home');
});

module.exports = router;
