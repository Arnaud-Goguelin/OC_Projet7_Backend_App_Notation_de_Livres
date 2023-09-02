const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

const app = express();

const authRoutes = require('./routes/authRoutes');
const booksRoutes = require('./routes/booksRoutes');
// const limiter = require('./middlewares/expressRateLimitMiddleware');

mongoose.connect(`mongodb+srv://${process.env.DBLOGIN}:${process.env.DBPASSWORD}@ocrp7database.to9hjtb.mongodb.net/OCRP7vieuxgrimoire?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie'))
	.catch(() => console.log('Connexion à MongoDB échouée'));

app.use(express.json());

// const cors = require('cors')
// app.use(cors())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
});

app.use(helmet({
	crossOriginResourcePolicy: false,
}));

const ERL = require('./middlewares/expressRateLimitMiddleware');

app.use(ERL.limiter);
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/imagesReceived', express.static(path.join(__dirname, 'imagesReceived')));

module.exports = app;