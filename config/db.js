// On importe mongoose
const mongoose = require('mongoose');

// Definition de l'url de connexion a la base de données
const url = process.env.MONGO_URI;

const connectDB = () => {
	console.log('Tentative de connexion à la base de données...');
	mongoose
		.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log('Connexion à la base de données réussie');
		})
		.catch((err) => {
			console.error('Erreur de connexion avec la base de données', err);
		});
};

// Export de la fonction connectDB
module.exports = connectDB;
