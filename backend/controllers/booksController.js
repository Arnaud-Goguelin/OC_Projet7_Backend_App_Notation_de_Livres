const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = async (req, res) => {
	try {
		const books = await Book.find();
		console.log('getAllBooks OK');
		console.log(books);
		return res.status(200).json(books);
	} catch (error) {
		return res.status(400).json({ error });
	}
};

exports.getOneBook = async (req, res) => {
	try {
		const book = Book.findOne({_id: `new ObjectId("${req.params.id}")`});
		// console.log(book);
		console.log(req.params.id);
		// console.log('getOneBook OK');
		return res.status(200).json({ book });
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
		return res.status(200).json({ threeBestBooks });
	} catch (error) {
		return res.status(400).json({ error });
	}
};

exports.postOneBook = async (req, res) => {
	try {
		const bookReceived = JSON.parse(req.body.book);
		// Pas besoin de supprimer les id, il n'y en a pas dans le corps de la requête
		// delete bookReceived._id;
		// delete bookReceived._userId;
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

// exports.gradeOneBook = async (req, res) => {
// Ennoncé:
// Définit la note pour le user ID fourni.
// La note doit être comprise entre 0 et 5.
// L'ID de l'utilisateur et la note doivent être ajoutés au
// tableau "rating" afin de ne pas laisser un utilisateur
// noter deux fois le même livre.
// Il n’est pas possible de modifier une note.
// La note moyenne "averageRating" doit être tenue à
// jour, et le livre renvoyé en réponse de la requête.

// TO DO:
// vérifier le userId reçu dans l'auth, s'il est bon, permettre l'ajout de la note
// supprimer l'userId de la requête et ajouter celui reçu dans l'auth
// Vérifier si la note est un nombre ET si comprise entre 0 et 5
// Vérifier si le user a déjà noté
// Mettre à jout la moyenne
//
// 	try {
// 		const gradeReceived = JSON.parse(req.body.rating);
// 		delete gradeReceived._userId;

// 	} catch (error) {
// 		return res.status(401).json({ error });
// 	}
// };

// exports.updateThing = (req, res) => {
// 	const thingObject = req.file ? {
// 		...JSON.parse(req.body.thing),
// 		imageUrl: `${req.protocol}://${req.get('host')}/imagessReceived/${req.file.filename}`
// 	} : { ...req.body };

// 	delete thingObject._userId;
// 	Thing.findOne({ _id: req.params.id })
// 		.then((thing) => {
// 			if (thing.userId != req.auth.userId) {
// 				res.status(401).json({ message: 'Non-autorisé' });
// 			} else {
// 				Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
// 					.then(() => res.status(200).json({ message: 'Objet modifié' }))
// 					.catch(error => res.status(401).json({ error }));
// 			}
// 		})
// 		.catch(error => res.status(400).json({ error }));
// };


exports.deleteOneBook = async (req, res) => {
	try {
		const bookToDelete = await Book.findOne({_id: req.params.id});
		if (bookToDelete.userId != req.auth.userId) {
			res.status(401).json({ message: 'Not authorized' });
		} else {
			try {
				const filename = bookToDelete.imageUrl.split('/imagesReceived/')[1];
				fs.unlink(`imagesReceived/${filename}`), async () => {
					await Book.deleteOne({_id: req.params.id});
					return res.status(200).json({ message: 'Livre supprimé'});
				};
			} catch (error) {
				return res.status(401).json({ error });
			}
		}

	} catch (error) {
		return res.status(500).json({ error });
	}
};