const router = require('express').Router();
const { Delegation, User } = require('../../db/models');

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const delegs = await Delegation.findAll({ raw: true });
      res.json(delegs);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newDeleg = await Delegation.create(req.body);
      res.send(newDeleg);
    } catch (err) {
      next(err);
    }
  });

router.route('/users/:userId').get(async (req, res, next) => {
  try {
    const delegs = await User.findAll({
      raw: true,
      attributes: { exclude: ['password'] },
      where: { id: req.params.userId },
      include: [
        {
          model: User,
          as: 'Delegatee',
          attributes: { exclude: ['password'] },
          through: { Delegation },
        },
      ],
    });
    console.log(delegs);
    res.json(delegs);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
