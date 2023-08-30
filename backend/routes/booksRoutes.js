const express = require('express');
const router = express.Router();
const auth = require('../midlewares/authMiddliware');
const multer = require('../midlewares/multerMidleware');

const booksController = require('../controllers/booksController');

router.get('/', booksController.getAllBooks);

router.get('/bestrating', booksController.getThreeBestBooks);

router.get('/:id', booksController.getOneBook);

router.post('/', auth, multer, booksController.postOneBook);

router.post('/:id/rating', auth, booksController.postGradeOneBook);

// router.put('/:id', auth, multer, booksController.updateOneBook);

router.delete('/:id', auth, booksController.deleteOneBook);

module.exports = router;