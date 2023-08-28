const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');

// const bodyParder = require('body-parser');
const app = express();

const authRoutes = require('./routes/authRoutes');
const booksRoutes = require('./routes/booksRoutes');

mongoose.connect('mongodb+srv://OCRP7User1:qR1iGSQOBpcSHvFt@ocrp7database.to9hjtb.mongodb.net/?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie'))
	.catch(() => console.log('Connexion à MongoDB échouée'));

app.use(express.json());
// app.use(bodyParder.json());

// const cors = require('cors')
// app.use(cors())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
// app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

