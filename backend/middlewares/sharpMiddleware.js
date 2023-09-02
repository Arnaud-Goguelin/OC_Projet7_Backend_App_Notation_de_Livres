const sharp = require('sharp');
const path = require('path');

const imageFormat = 'webp';

const imageSize =  {
	width: 206,
	height: 260,
	fit: 'cover',
	withoutEnlargement: false,
};

function sharpImage(req, res, next) {
	try {
		const imageToConvert = path.resolve(__dirname, '..', 'imagesReceived', req.file.filename);
		// const imageToConvert2 = `${req.protocol}://${req.get('host')}/imagesReceived/${req.file.filename}`;

		console.log(imageToConvert);
		// console.log(imageToConvert2)

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
			next();
		} else {
			sharp(imageToConvert)
				.resize(imageSize)
				.toFormat(imageFormat)
				.toFile(pathWhereToRegister);
			next();
		}
	
	} catch (error) {
		res.status(500).json( error );
	}
}

module.exports = { imageFormat , sharpImage };