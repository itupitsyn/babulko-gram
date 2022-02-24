const router = require('express').Router();
const { Entry, User } = require('../db/models');

router.get('/', async (req, res, next) => {
  try {
    const entries = await Entry.findAll({
      where: { userId: req.session.userId },
      raw: true,
      order: [['updatedAt', 'desc']],
    });
    // const Users = await User.findAll({
    //   where: { userId: req.session.userId },
    // });
    res.render('user', { entries });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
