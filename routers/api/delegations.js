const router = require('express').Router();
const { Delegation, User } = require('../../db/models');
const { itIsCurrentUser } = require('../../middlewares/allMiddleWares');

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
      console.log(req.body);
      const { userId } = req.session;
      const { delegateeId } = req.body;
      const newDeleg = await Delegation.create({ userId, delegateeId });
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
