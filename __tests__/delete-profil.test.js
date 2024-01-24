// __tests__/delete-profile.test.js

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

// Votre test pour la suppression du profil
describe('Delete Profile API', () => {
	it('Should allow deleting user profile', async () => {
		const userIdToDelete = '65b0c40a7d1309feda121aaa';

		// Générer un jeton d'authentification pour l'utilisateur
		const authToken = generateAuthToken(userIdToDelete);

		// Faire la demande pour supprimer le profil de l'utilisateur
		const response = await request(app)
			.delete(`/api/delete/${userIdToDelete}`)
			.set('Authorization', `Bearer ${authToken}`);

		console.log(response.body); // Log de la réponse

		// Assurez-vous que la demande est réussie (200)
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');

		// Assurez-vous que l'utilisateur n'existe plus en base de données
		const deletedUser = await authModel.findById(userIdToDelete);
		expect(deletedUser).toBeNull();
	});
});
