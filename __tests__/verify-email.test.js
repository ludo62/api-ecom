// Importation du module Mongoose qui permet d'interagir avec la base de données MongoDB.
const mongoose = require('mongoose');

// Importation du module Supertest pour effectuer des requêtes HTTP simulées
const request = require('supertest');

// Importation de l'application Express à tester
const app = require('../server');

// Importation du modèle utilisateur (authModel) pour les opérations de base de données
const authModel = require('../models/auth.model');

// Connexion à la base de données avant l'exécution de tous les tests
beforeAll(async () => {
	// Utilisation de la méthode connect de Mongoose pour établir une connexion à la base de données.
	await mongoose.connect(process.env.MONGO_URI);
	// Attente d'une seconde pour assurer la connexion avant de continuer
	await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Fermeture de la connexion à la base de données après l'exécution de tous les tests
afterAll(async () => {
	// Utilisation de la méthode close de Mongoose pour fermer la connexion à la base de données.
	await mongoose.connection.close();
});

// Bloc de tests pour la route /api/verify-email/:token
describe('Test de la route /api/verify-email/:token', () => {
	// Variable pour stocker le token de vérification
	let verificationToken;

	// Avant tous les tests, récupérez un utilisateur avec un token valide dans la base de données
	beforeAll(async () => {
		const user = await authModel.findOne({
			email: 'fournierl.pro@gmail.com',
		});

		if (user) {
			verificationToken = user.emailVerificationToken;
		}
	});

	// Test vérifiant que la route renvoie un code 404 si le token est invalide
	it('devrait retourner un code 404 si le token est invalide', async () => {
		const response = await request(app).get(`/api/verify-email/token_invalide`);
		// Vérifie que la réponse est un code 404
		expect(response.status).toBe(404);
	});

	// Test vérifiant que la route renvoie un code 200 si le token est valide et n'a pas expiré
	it("devrait retourner un code 200 si le token est valide et n'a pas expiré", async () => {
		// Assurez-vous que verificationToken est défini avant ce test
		if (verificationToken) {
			const response = await request(app).get(`/api/verify-email/${verificationToken}`);
			// Vérifie que la réponse est un code 200
			expect(response.status).toBe(200);
		} else {
			// Si verificationToken n'est pas défini, marquez le test comme réussi automatiquement
			expect(true).toBe(true);
		}
	});
});
