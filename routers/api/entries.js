const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const googleTTS = require('google-tts-api');
const tesseract = require('node-tesseract-ocr');
const { Buffer } = require('buffer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config();

const { Entry } = require('../../db/models');
const { allowedToSeeEntries } = require('../../middlewares/allMiddleWares');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename(req, file, cb) {
    const foundExt = file.originalname.match(/.*\.(\w*)/i);
    const ext = foundExt ? `.${foundExt[1]}` : '';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage });

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const entries = await Entry.findAll({
        order: [['updatedAt', 'desc']],
        where: { userId: req.session.userId },
        raw: true,
      });
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
      let text = '';
      try {
        const imgFile = await fs.readFile(imagePath);
        const form = new FormData();
        form.append('file', imgFile, req.file.filename);
        form.append('language', 'rus');
        const recognition = await axios.post(
          'https://api.ocr.space/parse/image',
          form,
          {
            headers: {
              ...form.getHeaders(),
              apikey: process.env.OCRKEY,
            },
          },
        );
        text = recognition.data.ParsedResults[0].ParsedText;
      } catch {
        text = await tesseract.recognize(imagePath, {
          lang: 'rus',
          oem: 3,
          psm: 3,
        });
      }
      // console.log('puk');
      text = text.replaceAll('\r\n', ' ').replaceAll('\n', ' ');

      // sound
      let sound;
      if (text) {
        sound = `/uploads/${req.file.filename}.mp3`;
        const soundParts = await googleTTS.getAllAudioBase64(text, {
          lang: 'ru',
          slow: false,
          host: 'https://translate.google.com',
          timeout: 10000,
        });
        let soundData = '';
        soundParts.forEach((el) => {
          soundData += el.base64;
        });
        await fs.writeFile(
          path.join('public', 'uploads', `${req.file.filename}.mp3`),
          Buffer.from(soundData, 'base64'),
        );
      } else {
        sound = '';
      }
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

router.get('/users/:userId', allowedToSeeEntries, async (req, res, next) => {
  try {
    const entries = await Entry.findAll({
      order: [['updatedAt', 'desc']],
      where: { userId: req.params.userId },
      raw: true,
    });
    res.json(entries);
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
