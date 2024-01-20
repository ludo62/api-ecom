// Importation du module Supertest pour effectuer des requêtes HTTP simulées
const request = require('supertest');

// Importation de l'application Express à tester
const app = require('../server');

// Importation du module Mongoose qui permet d'interagir avec la base de données MongoDB.
const mongoose = require('mongoose');

// Importation du module bcryptjs pour le hachage des mots de passe
const bcrypt = require('bcryptjs');

// Importation du module jsonwebtoken pour la création et la vérification des jetons JWT
const jwt = require('jsonwebtoken');

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

// Bloc de tests pour la route de connexion (Login API)
describe('Login API', () => {
	// Test spécifique pour vérifier que la route renvoie un jeton en cas de connexion réussie
	it('should return a token if login succeeds', async () => {
		// Supposons que vous ayez un utilisateur avec des informations d'identification connues dans votre base de données
		const existingUser = {
			_id: new mongoose.Types.ObjectId(),
			email: 'fournier@gmail.com',
			// Hashage du mot de passe pour simuler le stockage sécurisé en base de données
			password: await bcrypt.hash('123456', 10),
		};

		// Simulation de la méthode findOne pour renvoyer l'utilisateur existant lorsqu'elle est appelée
		jest.spyOn(authModel, 'findOne').mockResolvedValue(existingUser);

		// Effectuer la requête de connexion à la route /api/login en fournissant les informations d'identification
		const response = await request(app).post('/api/login').send({
			email: 'fournier@gmail.com',
			password: '123456', // Fournir le mot de passe en clair pour la comparaison
		});

		// Vérifier que la réponse est réussie (statut 200)
		expect(response.status).toBe(200);

		// Vérifier que la réponse contient un jeton
		expect(response.body).toHaveProperty('token');

		// Décoder le jeton pour vérifier son contenu (facultatif mais recommandé)
		const decodedToken = jwt.verify(response.body.token, process.env.JWT_SECRET);

		// Vérifier que le jeton contient les informations attendues
		expect(decodedToken).toHaveProperty('user');
		expect(decodedToken.user).toHaveProperty('id', existingUser._id.toHexString());
		expect(decodedToken.user).toHaveProperty('email', existingUser.email);
	});
});
