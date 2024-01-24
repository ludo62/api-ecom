const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');

// Fonction utilitaire pour générer un jeton d'authentification
function generateAuthToken(userId) {
	const secretKey = process.env.JWT_SECRET;
	const expiresIn = '1h';

	// Utilisation de la bibliothèque jsonwebtoken pour générer le jeton
	return jwt.sign({ userId }, secretKey, { expiresIn });
}

// Connexion à la base de données avant l'exécution des tests
beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_URI);
	await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Fermeture de la connexion après l'exécution des tests
afterAll(async () => {
	await mongoose.connection.close();
});

// Votre test pour récupérer un utilisateur par ID
describe('Delete Profile API', () => {
	it('Should allow deleting user profile for admin', async () => {
		// ID du profil utilisateur a supprimé
		const userIdToDelete = '65b0da9568b27d19b644b4be';

		// Générer un jeton d'authentification pour l'admin
		const authToken = generateAuthToken(userIdToDelete);

		// Faire la demande pour supprimer un utilisateur par ID
		const response = await request(app)
			.delete(`/api/delete/${userIdToDelete}`)
			.set('Authorization', `Bearer ${authToken}`);

		// Log de la réponse
		console.log(response.body);

		// Assurez-vous que la demande est réussie (200)
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Profil supprimé avec succès');

		// S'assurer que le profil utilisateur à bien été supprimées de la base de données
		const deletedUser = await authModel.findById(userIdToDelete);
		expect(deletedUser).toBeNull();
	});
});
