const Book = require('../models/Book');
const fs = require('fs');

const sharp = require('../middlewares/sharpMiddleware');
let newFileName = null;

function defineNewFileName(req) {
	const fileNameArray = req.file.filename.split('.');
	fileNameArray.pop();
	fileNameArray.push(sharp.imageFormat);
	newFileName = fileNameArray.join('.');
}

exports.getAllBooks = async (req, res) => {
	try {
		const books = await Book.find();
		return res.status(200).json(books);
	} catch (error) {
		return res.status(400).json(error);
	}
};

exports.getOneBook = async (req, res) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });
		return res.status(200).json( book );
	} catch (error) {
		return res.status(400).json(error);
	}
};

exports.getThreeBestBooks = async (req, res) => {
	try {
		const books = await Book.find();
		const sortedBooks = books.sort(function (bookA, bookB) {
			return bookB.averageRating - bookA.averageRating;});

		const threeBestBooks = sortedBooks.slice(0,3);
		return res.status(200).json( threeBestBooks );
	} catch (error) {
		return res.status(400).json(error);
	}
};

exports.postOneBook = async (req, res) => {
	try {
		const bookReceived = JSON.parse(req.body.book);
		delete bookReceived.ratings;
		delete bookReceived.averageRating;

		defineNewFileName(req);

		const bookToPost = new Book ({
			...bookReceived,
			userId: req.auth.userId,
			imageUrl : `${req.protocol}://${req.get('host')}/imagesReceived/converted${newFileName}`,
			ratings: [],
			averageRating: 0
		});
		await bookToPost.save();
		await fs.unlink((`imagesReceived/${req.file.filename}`), () => console.log('fichier supprimé') );
		return res.status(201).json({message : 'Livre enregistré'});
	} catch (error) {
		return res.status(400).json(error);
	}
};

exports.postGradeOneBook = async (req, res) => {
	const gradeReceived = req.body.rating;

	if (gradeReceived < 0 || gradeReceived > 5) {
		return res.status(400).json({ message: 'La note doit être comprise en 0 et 5' });
	}

	const newGrade = {
		userId: req.auth.userId,
		grade: gradeReceived
	};

	try {
		const bookToEvaluate = await Book.findOne({ _id: req.params.id });

		const userGrade = bookToEvaluate.ratings.find(rating => rating.userId === req.auth.userId);
		if (userGrade) {
			return res.status(400).json({message: 'Il n\'est possible d\'évaluer un livre qu\'une seule fois'});
		}
		
		const allGrades = bookToEvaluate.ratings.map(rating => rating.grade);
		allGrades.push(gradeReceived);
		
		const sumGrades = allGrades.reduce((somme, grade) => somme + grade, 0);
		const newAverageRating = Math.round(sumGrades / allGrades.length);

		await Book.updateOne(
			{ _id: req.params.id }, 
			{ 
				$push: { ratings: newGrade },
				$set: { averageRating: newAverageRating },
				_id: req.params.id 
			}
		);

		const bookEvaluated = await Book.findOne({ _id: req.params.id });
		return res.status(200).json( bookEvaluated );
		
	} catch (error) {
		return res.status(401).json(error);
	}
};

exports.updateOneBook = async (req, res) => {
	try {
		let bookReceived = null;

		if (req.file) {

			defineNewFileName(req);

			bookReceived = 
			{...JSON.parse(req.body.book),
				imageUrl: `${req.protocol}://${req.get('host')}/imagesReceived/converted${newFileName}`
			};
		} else {
			bookReceived = { ...req.body };
		}

		delete bookReceived._userId;
		const bookToUpdate = await Book.findOne({ _id: req.params.id });
		if (bookToUpdate.userId != req.auth.userId) {return res.status(401).json({ message: 'Utilisateur(trice) non autorisé(e)' });}

		await Book.updateOne(
			{ _id: req.params.id },
			{ ...bookReceived,
				_id: req.params.id }
		);
		await fs.unlink((`imagesReceived/${req.file.filename}`), () => console.log('fichier supprimé') );
		return res.status(200).json({ message: 'Livre modifié '});
		
	} catch (error) {
		return res.status(400).json({ message: 'au moins ma route fonctionne' });
	}
};

exports.deleteOneBook = async (req, res) => {
	try {
		const bookToDelete = await Book.findOne({_id: req.params.id});
		if (bookToDelete.userId != req.auth.userId) {
			res.status(401).json({ message: 'Utilisateur non autorisé' });
		} else {
			try {
				const fileToDelete = bookToDelete.imageUrl.split('/imagesReceived/')[1];
				fs.unlink(`imagesReceived/${fileToDelete}`,  async () => {
					await Book.deleteOne({_id: req.params.id});
					return res.status(200).json({ message: 'Livre supprimé'});
				});
			} catch (error) {
				return res.status(401).json(error);
			}
		}
	} catch (error) {
		return res.status(500).json(error);
	}
};