const router = require('express').Router();

router.get('/', (req, res) => {
  res.redirect('/entries');
});

module.exports = router;
