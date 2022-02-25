const router = require('express').Router();
const {
  Entry,
  User,
  Status,
  Sequelize: { Op },
  Delegation,
} = require('../db/models');

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
    const delegs = await Delegation.findAll({
      where: { userId: req.session.userId },
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
    res.render('user', { entries, users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
