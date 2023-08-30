const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = async (req, res) => {
	try {
		const books = await Book.find();
		return res.status(200).json(books);
	} catch (error) {
		return res.status(400).json({ error });
	}
};

exports.getOneBook = async (req, res) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });
		return res.status(200).json( book );
	} catch (error) {
		return res.status(400).json({ error });
	}
};

exports.getThreeBestBooks = async (req, res) => {
	try {
		const books = await Book.find();
		const threeBestBooks = books
			.sort( n => books[n+1].averageRating - books[n].averageRating )
			.slice(0,3);
		return res.status(200).json( threeBestBooks );
	} catch (error) {
		return res.status(400).json({ error });
	}
};

exports.postOneBook = async (req, res) => {
	try {
		const bookReceived = JSON.parse(req.body.book);
		const bookToPost = new Book ({
			...bookReceived,
			userId: req.auth.userId,
			imageUrl : `${req.protocol}://${req.get('host')}/imagesReceived/${req.file.filename}`
		});
		await bookToPost.save();
		return res.status(201).json({message : 'Livre enregistré'});
	} catch (error) {
		return res.status(400).json({ error });
	}
};

exports.gradeOneBook = async (req, res) => {
	const gradeReceived = req.body.rating;

	if (gradeReceived < 0 || gradeReceived > 5) {
		return res.status(400).json({ error: 'La note doit être comprise en 0 et 5' });
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
		const newAverageRating = sumGrades / allGrades.length;

		await Book.updateOne(
			{ _id: req.params.id }, 
			{ 
				$push: { ratings: newGrade },
				$set: { averageRating: newAverageRating },
				_id: req.params.id 
			}
		);

		const result = await Book.findOne({ _id: req.params.id });
		return res.status(200).json({ result });
	} catch (error) {
		return res.status(401).json({ error });
	}
};

// exports.updateThing = (req, res, next) => {
//     const thingObject = req.file ? {
//         ...JSON.parse(req.body.thing),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : { ...req.body };

//     delete thingObject._userId;
//     Thing.findOne({ _id: req.params.id })
//         .then((thing) => {
//             if (thing.userId != req.auth.userId) {
//                 res.status(401).json({ message: 'Non-autorisé' });
//             } else {
//                 Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
//                     .then(() => res.status(200).json({ message: 'Objet modifié' }))
//                     .catch(error => res.status(401).json({ error }))
//             }
//         })
//         .catch(error => res.status(400).json({ error }))
// };



exports.deleteOneBook = async (req, res) => {
	try {
		const bookToDelete = await Book.findOne({_id: req.params.id});
		if (bookToDelete.userId != req.auth.userId) {
			res.status(401).json({ message: 'Utilisateur non autorisé' });
		} else {
			try {
				const filename = bookToDelete.imageUrl.split('/imagesReceived/')[1];
				fs.unlink(`imagesReceived/${filename}`,  async () => {
					await Book.deleteOne({_id: req.params.id});
					return res.status(200).json({ message: 'Livre supprimé'});
				});
			} catch (error) {
				return res.status(401).json({ error });
			}
		}
	} catch (error) {
		return res.status(500).json({ error });
	}
};