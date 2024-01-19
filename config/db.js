// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
	try {
		const url = process.env.MONGO_URI;
		await mongoose.connect(url);
		console.log('Connexion à la base de données réussie.');
	} catch (error) {
		console.log('Erreur de connexion à la base de données.');
		console.log(error);
	}
};

module.exports = connectDB;
