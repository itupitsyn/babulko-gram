const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const googleTTS = require('google-tts-api');
const fs = require('fs').promises;
const { Buffer } = require('buffer');

const { Entry } = require('../../db/models');

const tesseract = require('node-tesseract-ocr');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/uploads');
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
  .post(upload.single('img'), async (req, res, next) => {
    try {
      // image
      const image = `/uploads/${req.file.filename}`;
      const imagePath = path.join('public', 'uploads', req.file.filename);
      // text
      const text = await tesseract.recognize(imagePath, {
        lang: 'rus+eng',
        oem: 1,
        psm: 3,
      });
      const sound = `/uploads/${req.file.filename}.mp3`;
      const soundParts = await googleTTS.getAllAudioBase64(text, {
        lang: 'ru',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
        splitPunct: ',.?',
      });

      let soundData = '';
      soundParts.forEach((el) => {
        soundData += el.base64;
      });
      await fs.writeFile(
        path.join('public', 'uploads', `${req.file.filename}.mp3`),
        Buffer.from(soundData, 'base64'),
      );
      console.log(req.session.userId);
      const newEntry = await Entry.create({
        image,
        text,
        sound,
        userId: req.session.userId,
      });
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
