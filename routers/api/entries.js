const router = require('express').Router();
const multer = require('multer');

const { Entry } = require('../../db/models');

const tesseract = require('node-tesseract-ocr');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../../public/uploads');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});
const upload = multer({ storage });

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const entries = await Entry.findAll({ raw: true });
      res.json(entries);
    } catch (err) {
      next(err);
    }
  })
  .post(upload.single('image'), async (req, res, next) => {
    try {
      const image = `/uploads/${req.file.originalname}`;
      const text = await tesseract.recognize(image, {
        lang: 'rus+eng',
        oem: 1,
        psm: 3,
      });
      const newEntry = await Entry.creat({ image, text });
      res.json(newEntry);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      res.json(
        await Entry.findOne({ where: { id: req.params.id }, raw: true }),
      );
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Entry.destroy({ where: { id: req.params.id } });
      res.end();
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
