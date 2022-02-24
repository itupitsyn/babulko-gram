const router = require('express').Router();
const multer = require('multer');
const { Entry, Status } = require('../db/models');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });


router.get('/', async (req, res) => {
    res.render('/user', { entries, status });
    const entries = await Entry.findAll({ raw: true })
    const status = await Status.findAll({ raw: true })
});

router.post('/', upload.single('img'), async (req, res) => {
    res.redirect('/user');
});

module.exports = router;