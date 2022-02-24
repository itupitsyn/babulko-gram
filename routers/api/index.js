const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/statuses', require('./statuses'));
router.use('/entries', require('./entries'));
router.use('/delegations', require('./delegations'));

module.exports = router;
