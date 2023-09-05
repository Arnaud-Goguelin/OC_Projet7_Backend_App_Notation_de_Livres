const express = require('express');
const router = express.Router();

const PES = require('../middlewares/perfectExpressSanitizerMiddleware');
const auth = require('../middlewares/authMiddleware');
const multer = require('../middlewares/multerMidleware');
const sharp = require('../middlewares/sharpMiddleware');

const booksController = require('../controllers/booksController');

router.get('/', booksController.getAllBooks);

router.get('/bestrating', booksController.getThreeBestBooks);

router.get('/:id', booksController.getOneBook);

router.post('/', PES.sanitizer, auth, multer, sharp.sharpImage, booksController.postOneBook);

router.post('/:id/rating', PES.sanitizer, auth, booksController.postGradeOneBook);

router.put('/:id', PES.sanitizer, auth, multer, sharp.sharpImage, booksController.updateOneBook);

router.delete('/:id', auth, booksController.deleteOneBook);

module.exports = router;