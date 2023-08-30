const express = require('express');
const router = express.Router();
const auth = require('../midlewares/authMiddliware');
const multer = require('../midlewares/multerMidleware');

const booksController = require('../controllers/booksController');

router.get('/', booksController.getAllBooks);

router.get('/:id', booksController.getOneBook);

// router.get('/bestrating', booksController.getThreeBestBooks);

router.post('/', auth, multer, booksController.postOneBook);

router.post('/:id/rating', auth, booksController.gradeOneBook);

// router.put('/:id', auth, multer, booksController.updateOneBook);

router.delete('/:id', auth, booksController.deleteOneBook);

module.exports = router;