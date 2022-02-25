const router = require('express').Router();

const { allowedToSeeEntries } = require('../middlewares/allMiddleWares');
const {
  Entry,
  User,
  Status,
  Sequelize: { Op },
  Delegation,
} = require('../db/models');

router.get('/:userId?', allowedToSeeEntries, async (req, res, next) => {
  try {
    const entries = await Entry.findAll({
      where: {
        userId: req.params.userId ? req.params.userId : req.session.userId,
      },
      raw: true,
      order: [['updatedAt', 'desc']],
    });

    const delegs = await Delegation.findAll({
      where: { userId: req.session.userId },
      // attributes: ['id', 'userId', 'delegateeId'],
    });

    const delegators = await Delegation.findAll({
      where: { delegateeId: req.session.userId },
    });
    const users = await User.findAll({
      attributes: [['id', 'userId'], 'login'],
      where: {
        [Op.not]: [{ id: req.session.userId }],
        id: {
          [Op.notIn]: !delegs ? [] : delegs.map((el) => el.delegateeId),
        },
      },
      include: { model: Status, attributes: ['name'] },
    });

    const allowedUsers = await User.findAll({
      attributes: [['id', 'userId'], 'login'],
      where: {
        id: {
          [Op.in]: !delegs ? [] : delegators.map((el) => el.userId),
        },
      },
      include: { model: Status, attributes: ['name'] },
    });

    // const ourDelegatee = [];
    const ourDelegatee = await User.findAll({
      attributes: [['id', 'userId'], 'login'],
      where: {
        id: {
          [Op.in]: !delegs ? [] : delegs.map((el) => el.delegateeId),
        },
      },
      include: { model: Status, attributes: ['name'] },
    });

    allowedUsers.forEach(
      (el) =>
        (el.selected =
          Number(req.params.userId) === Number(el.dataValues.userId)),
    );

    res.render('user', {
      entries,
      users,
      allowedUsers,
      ourDelegatee,
      selected:
        req.params.userId !== undefined &&
        Number(req.params.userId) !== Number(req.session.userId),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
