const sharp = require('sharp');
const path = require('path');

const imageFormat = 'webp';

const imageSize =  {
	width: 206,
	height: 260,
	fit: 'cover',
	withoutEnlargement: true,
};

module.exports = (req, res, next) => {
	try {
		const filename = req.file.originalname.split(' ').join('_');

		const filenameArray = filename.split('.');
	
	
		filenameArray.pop();
		const filenameWithoutExtention = filenameArray.join('.');
	
		const uniqueFileName = filenameWithoutExtention + Date.now() + '.' + imageFormat;
		const pathWhereToRegister = path.resolve(__dirname, '..', 'imagesReceived', uniqueFileName);
		
		const imageReceived = req.file.buffer;
	
		if (filenameArray[-1] === 'webp') {
			sharp(imageReceived)
				.resize(imageSize)
				.toFile(pathWhereToRegister);
			next();
		} else {
			sharp(imageReceived)
				.resize(imageSize)
				.toFormat(imageFormat)
				.toFile(pathWhereToRegister);
			next();
		}
	
	} catch (error) {
		res.status(500).json({ error });
	}
};