const request = require('supertest');
const app = require('../server');
const authModel = require('../models/auth.model');
const mongoose = require('mongoose');

// Connecter à la base de données avant l'exécution de tous les tests
beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_URI);
	await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Fermer la connexion à la base de données après l'exécution de tous les tests
afterAll(async () => {
	await mongoose.connection.close();
});

describe('Forgot Password API', () => {
	let findOneAndUpdateSpy;

	// Créer un espion sur la méthode findOneAndUpdate avant chaque test
	beforeEach(() => {
		findOneAndUpdateSpy = jest.spyOn(authModel, 'findOneAndUpdate');
	});

	// Restaurer les mocks après les tests
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should send a reset password email if the email exists', async () => {
		const existingUser = {
			_id: '65ac1a8be73682c2fe87e653',
			email: 'fournier@gmail.com',
			resetPasswordToken: 'someToken',
			resetPasswordTokenExpires: new Date(),
		};

		findOneAndUpdateSpy.mockResolvedValue(existingUser);

		const response = await request(app).post('/api/forgot-password').send({
			email: 'fournier@gmail.com',
		});

		// Ajoutez des logs pour voir si findOneAndUpdate est appelé
		console.log('findOneAndUpdateSpy calls:', findOneAndUpdateSpy.mock.calls);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			message:
				'Un email de réinitialisation de mot de passe à été envoyé sur votre adresse email',
		});

		// Vérifier si findOneAndUpdate a été appelé avec le bon email et le bon update
		expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
			{ email: 'fournier@gmail.com' },
			{
				resetPasswordToken: expect.any(String),
				resetPasswordTokenExpires: expect.any(Date),
			},
			{ new: true },
		);

		// Assurez-vous que la méthode save n'a pas été appelée
		expect(authModel.prototype.save).not.toHaveBeenCalled();
	});
});
