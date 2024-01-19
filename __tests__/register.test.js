const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const path = require('path');

// Connect to the database before all tests
beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_URI);
	await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Close the database connection after all tests
afterAll(async () => {
	await mongoose.connection.close();
});

// Clear the database and re-initialize it before each test
beforeEach(async () => {
	// Code to clear and re-initialize the database, e.g., by removing all documents from collections
	// This ensures that each test starts with a clean slate
});

describe('Test de la route register', () => {
	it("devrait retourner 201 si l'utilisateur est créé", async () => {
		const response = await request(app)
			.post('/api/register')
			.field('lastname', 'Doe')
			.field('firstname', 'John')
			.field('birthday', '1990-01-01')
			.field('address', '1 rue de la paix')
			.field('zipcode', '75000')
			.field('city', 'Paris')
			.field('phone', '0606060606')
			.field('email', 'fournier@gmail.com')
			.field('password', '123456')
			.attach('image', path.resolve(__dirname, '../image/avatar.jpg'));

		console.log('Réponse reçue:', response.body);
		expect(response.status).toBe(201);

		expect(response.body).toHaveProperty(
			'message',
			'Utilisateur créé avec succès. Vérifiez votre email pour activer votre compte',
		);
	});
});
