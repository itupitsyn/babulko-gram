const router = require('express').Router();
const crypto = require('crypto');

const { User, Status } = require('../../db/models');

async function getUser(id) {
  return User.findOne({
    attributes: { exclude: ['password'] },
    include: {
      model: Status,
      attributes: ['id', 'name'],
    },
    raw: true,
    where: { id },
  });
}

async function getUsers() {
  return User.findAll({
    attributes: { exclude: ['password'] },
    include: {
      model: Status,
      attributes: ['id', 'name'],
    },
    raw: true,
  });
}

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      res.json(await getUsers());
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newUser = {};
      newUser.login = req.body.login;
      newUser.email = req.body.email;
      newUser.password = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex');
      newUser.statusId = req.body.statusId;
      await User.create(newUser);
      res.end();
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      res.json(await getUser(req.params.id));
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      const userFromDB = await User.findOne({ where: { id: req.params.id } });
      userFromDB.login = req.body.login;
      userFromDB.password = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex');
      userFromDB.statusId = req.body.statusId;
      await userFromDB.save();
      res.end();
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
