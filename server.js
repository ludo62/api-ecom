// Permet de charger les variables d'environnement depuis un fichier .env
require('dotenv').config();

// Import des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import des routes pour l'authentification
const authRoutes = require('./routes/auth.route');
// Import de la configuration de la base de données
const connectDB = require('./config/db');

// Initialisation de l'application Express
const app = express();

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Middleware pour parser les corps des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des routes pour l'authentification
app.use('/api', authRoutes);

// Configuration des options CORS
const corsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
};

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
app.use(cors(corsOptions));

// Définition du port pour le serveur
const PORT = process.env.PORT;

// Fonction pour démarrer le serveur
const start = async () => {
	try {
		// Connexion à la base de données
		await connectDB();

		// Démarrage du serveur Express sur le port spécifié
		app.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
		console.log('DB connected');
	} catch (error) {
		console.log(error);
	}
};

// Appel de la fonction pour démarrer le serveur
start();
