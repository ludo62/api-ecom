// __tests__/delete-user.test.js

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');

// Fonction utilitaire pour générer un jeton d'authentification
function generateAuthToken(userId, role) {
	const secretKey = process.env.JWT_SECRET;
	const expiresIn = '1h';

	// Utilisation de la bibliothèque jsonwebtoken pour générer le jeton
	return jwt.sign({ userId, role }, secretKey, { expiresIn });
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

// Votre test pour la suppression d'un utilisateur en tant qu'admin
describe('Delete User API', () => {
	it('Should allow deleting user profile for admin', async () => {
		// ID de l'utilisateur dans la base de données
		const userIdToDelete = '65af7daed7a709bd211607c8';
		// ID de l'admin dans la base de données
		const adminUserId = '65afa2a85bd581f923d141b8';

		// Générer un jeton d'authentification pour l'admin
		const authToken = generateAuthToken(adminUserId, 'admin');

		// Faire la demande pour supprimer l'utilisateur en tant qu'admin
		const response = await request(app)
			.delete(`/api/delete-user/${userIdToDelete}`)
			.set('Authorization', `Bearer ${authToken}`);

		console.log(response.body); // Log de la réponse

		// Assurez-vous que la demande est réussie (200)
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');

		// Assurez-vous que l'utilisateur a été supprimé de la base de données
		const deletedUser = await authModel.findById(userIdToDelete);
		expect(deletedUser).toBeNull();
	});
});
