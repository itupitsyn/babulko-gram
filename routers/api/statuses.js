const router = require('express').Router();
const { Status } = require('../../db/models');

router.route('/').get(async (req, res, next) => {
  try {
    const statuses = await Status.findAll({ raw: true });
    res.json(statuses);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
