const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imageFormat = 'webp';

const imageSize =  {
	width: 206,
	height: 260,
	fit: 'cover',
	withoutEnlargement: true,
};

function deleteOldFile(req) {
	// const URL = `${req.protocol}://${req.get('host')}/imagesReceived/${req.file.filename}`;
	// console.log(req.file.filename);
	// const fileToDelete = decodeURIComponent(URL.split('/imagesReceived/')[1]);
	// console.log(fileToDelete);
	const pahtToFileToDelete = path.resolve(__dirname, '..', 'imagesReceived', req.file.filename);
	fs.unlink(pahtToFileToDelete, () => console.log('fichier supprimé') );
}

function sharpImage(req, res, next) {
	try {
		const imageToConvert = path.resolve(__dirname, '..', 'imagesReceived', req.file.filename);
		// `${req.protocol}://${req.get('host')}/imagesReceived/${req.file.filename}`;

		const fileName = req.file.filename.split(' ').join('_');
		const fileNameArray = fileName.split('.');
		fileNameArray.pop();
		const filenameWithoutExtention = fileNameArray[0];

		const uniqueFileName = 'converted' + filenameWithoutExtention + '.' + imageFormat;
		const pathWhereToRegister = path.resolve(__dirname, '..', 'imagesReceived', uniqueFileName);

		if (fileNameArray[-1] === imageFormat) {
			sharp(imageToConvert)
				.resize(imageSize)
				.toFile(pathWhereToRegister);
			// deleteOldFile(req);
			next();
		} else {
			sharp(imageToConvert)
				.resize(imageSize)
				.toFormat(imageFormat)
				.toFile(pathWhereToRegister);
			// deleteOldFile(req);
			next();
		}
	
	} catch (error) {
		res.status(500).json( error );
	}
}

module.exports = { imageFormat , sharpImage };