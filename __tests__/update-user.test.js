// __tests__/update-user.test.js

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

// Votre test pour la modification d'un utilisateur en tant qu'admin
describe('Update User API', () => {
	it('Should allow updating user profile for admin', async () => {
		// ID de l'utilisateur dans la base de données
		const userIdToUpdate = '65af7daed7a709bd211607c8';
		// ID de l'admin dans la base de données
		const adminUserId = '65afa2a85bd581f923d141b8';

		// Générer un jeton d'authentification pour l'admin
		const authToken = generateAuthToken(adminUserId, 'admin');

		// Faire la demande pour mettre à jour le profil de l'utilisateur en tant qu'admin
		const response = await request(app)
			.put(`/api/update-user/${userIdToUpdate}`)
			.set('Authorization', `Bearer ${authToken}`)
			.send({
				lastname: 'NouveauNom2',
				firstname: 'NouveauPrenom2',
				birthday: '1995-01-01',
				address: 'Nouvelle adresse2',
				zipcode: '62587',
				city: 'Loly ville2',
				phone: '0608070905',
				email: 'fournier2@gmail.com',
			});

		console.log(response.body); // Log de la réponse

		// Assurez-vous que la demande est réussie (200)
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Utilisateur mis à jour avec succès');
		expect(response.body).toHaveProperty('user');

		// Assurez-vous que les informations de l'utilisateur ont été mises à jour correctement
		const updatedUser = await authModel.findById(userIdToUpdate);
		expect(updatedUser.lastname).toBe('NouveauNom2');
		expect(updatedUser.firstname).toBe('NouveauPrenom2');
		expect(updatedUser.birthday).toBe('1995-01-01');
		expect(updatedUser.address).toBe('Nouvelle adresse2');
		expect(updatedUser.zipcode).toBe('62587');
		expect(updatedUser.city).toBe('Loly ville2');
		expect(updatedUser.phone).toBe('0608070905');
		expect(updatedUser.email).toBe('fournier2@gmail.com');
	});
});
