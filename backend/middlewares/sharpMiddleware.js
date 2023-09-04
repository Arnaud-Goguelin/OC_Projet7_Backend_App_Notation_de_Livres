const sharp = require('sharp');

const imageFormat = 'webp';

const imageSize =  {
	width: 206,
	height: 260,
	fit: 'cover',
	withoutEnlargement: false,
};

exports.sharpImage = async (req, res, next) => {
	try {
		if(!req.file) { return next(); }

		const fileNameArray = req.file.originalname.split('.');
		const fileNameWithoutExtention = fileNameArray[0];

		const uniqueFileName = fileNameWithoutExtention + Date.now() + '.' + imageFormat;
		const pathWhereToRegister = `imagesReceived/${uniqueFileName}`;
		
		req.file.filename = uniqueFileName;
 
		if (fileNameArray[-1] === imageFormat) {
			await sharp(req.file.buffer)
				.resize(imageSize)
				.toFile(pathWhereToRegister);
			
			return next();
		} else {
			await sharp(req.file.buffer)
				.resize(imageSize)
				.toFormat(imageFormat)
				.toFile(pathWhereToRegister);
			
			return next();
		}
	
	} catch (error) {
		res.status(500).json({ error });
	}
};