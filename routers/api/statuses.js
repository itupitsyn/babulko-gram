const router = require('express').Router();
const { Status } = require('../../db/models');

router.route('/').get(async (req, res) => {
  const statuses = await Status.findAll({ raw: true });
  res.json(statuses);
});

module.exports = router;
