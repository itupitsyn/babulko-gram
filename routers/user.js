const router = require('express').Router();
const multer = require('multer');
// const {}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')    // путь сохранения файла
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname);  // название будет оригинальным
    },
});

const upload = multer({ storage: storage });


router.get('/', (req, res) => {
    res.render('user');
});

router.post('/', upload.single('img'), (req, res) => {
    // console.log(req.body)
    console.log(req.file);
    res.render('user');
});

module.exports = router;
