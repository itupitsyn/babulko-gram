const router = require('express').Router();
const { Delegation, User } = require('../../db/models');
// const { allowedToSeeEntries } = require('../../middlewares/allMiddleWares');

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const delegs = await Delegation.findAll({
        raw: true,
        where: { userId: req.session.userId },
      });
      res.json(delegs);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { userId } = req.session;
      const { delegateeId } = req.body;
      const newDeleg = await Delegation.create({ userId, delegateeId });
      res.send(newDeleg);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Delegation.destroy({
        where: { delegateeId: req.body.delegateeId, userId: req.session.userId },
      });
      res.end();
    } catch (err) {
      next(err);
    }
  });

// router.route('/users/').get(async (req, res, next) => {
//   try {
//     const delegs = await User.findAll({
//       raw: true,
//       attributes: { exclude: ['password'] },
//       where: { id: req.session.userId },
//       include: [
//         {
//           model: User,
//           as: 'Delegatee',
//           attributes: { exclude: ['password'] },
//           through: { Delegation },
//         },
//       ],
//     });
//     console.log(delegs);
//     res.json(delegs);
//   } catch (err) {
//     next(err);
//   }
// });
module.exports = router;
