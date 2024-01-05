// On importe la bibliothèque (package) mongoose
const mongoose = require('mongoose');

// Fonction connectDB permettant de connecter notre application à la base de données
const connectDB = () => {
	return mongoose.connect(process.env.MONGO_URI);
};

// Export de la fonction connectDB
module.exports = connectDB;
