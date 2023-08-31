const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const multer = require('../middlewares/multerMidleware');
const sharp = require('../middlewares/sharpMiddleware');

const booksController = require('../controllers/booksController');

router.get('/', booksController.getAllBooks);

router.get('/bestrating', booksController.getThreeBestBooks);

router.get('/:id', booksController.getOneBook);

router.post('/', auth, multer, sharp, booksController.postOneBook);

router.post('/:id/rating', auth, booksController.postGradeOneBook);

router.put('/:id', auth, multer, sharp, booksController.updateOneBook);

router.delete('/:id', auth, booksController.deleteOneBook);

module.exports = router;