// Importation du module Mongoose qui permet d'interagir avec la base de données MongoDB.
const mongoose = require('mongoose');

// Chargement des variables d'environnement à partir du fichier .env.
require('dotenv').config();

/* Connexion à la base de données avant l'exécution de tous les tests. */
beforeAll(async () => {
	// Utilisation de la méthode connect de Mongoose pour établir une connexion à la base de données.
	// La valeur de l'URI de la base de données est récupérée à partir des variables d'environnement.

	await mongoose.connect(process.env.MONGO_URI);
});

/* Fermeture de la connexion à la base de données après l'exécution de tous les tests. */
afterAll(async () => {
	// Utilisation de la méthode close de Mongoose pour fermer la connexion à la base de données.
	await mongoose.connection.close();
});

// Test vérifiant que la connexion à la base de données a été établie avec succès.
test('should connect to the database', async () => {
	// La connexion est établie si ce test réussit.
	// La propriété readyState de l'objet mongoose.connection est évaluée à 1 lorsque la connexion est établie.
	const isConnected = mongoose.connection.readyState === 1;

	// Assertion vérifiant que la connexion est établie avec succès.
	expect(isConnected).toBeTruthy();
	// expect(isConnected).toBeTruthy(); : Cette assertion vérifie que la variable isConnected est évaluée à true. Si la connexion est établie, isConnected sera true, et le test réussira.
});
