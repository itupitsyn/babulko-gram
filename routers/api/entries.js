const router = require('express').Router();
const { Entry } = require('../../db/models');

router.route('/').get(async (req, res, next) => {
  try {
    const entries = await Entry.findAll({ raw: true });
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
