const router = require('express').Router();
const { Entry } = require('../../db/models');

router.route('/').get(async (req, res) => {
  const entries = await Entry.findAll({ raw: true });
  
});

module.exports = router;
