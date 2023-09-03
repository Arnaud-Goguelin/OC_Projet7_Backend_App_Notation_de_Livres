const sharp = require('sharp');
const fs = require('fs');

const imageFormat = 'webp';

const imageSize =  {
	width: 206,
	height: 260,
	fit: 'cover',
	withoutEnlargement: false,
};

function deleteOldFile(fileToDelete) {
	fs.unlink((`imagesReceived/${fileToDelete}`), () => console.log('fichier supprimé') );
}

exports.sharpImage = async(req, res, next) => {
	try {

		const fileNameArray = req.file.originalname.split('.');
		const fileNameWithoutExtention = fileNameArray[0];

		const uniqueFileName = fileNameWithoutExtention + Date.now() + '.' + imageFormat;
		const pathWhereToRegister = `imagesReceived/${uniqueFileName}`;
		
		req.file.filename = uniqueFileName;
 
		if (fileNameArray[-1] === imageFormat) {
			await sharp(req.file.buffer)
				.resize(imageSize)
				.toFile(pathWhereToRegister);
			
			await deleteOldFile(req.file.originalname);
			next();
		} else {
			await sharp(req.file.buffer)
				.resize(imageSize)
				.toFormat(imageFormat)
				.toFile(pathWhereToRegister);
			
			await deleteOldFile(req.file.originalname);
			next();
		}
	
	} catch (error) {
		res.status(500).json(error);
	}
};