// Importation du module Supertest pour effectuer des requêtes HTTP simulées
const request = require('supertest');

// Importation du module Mongoose qui permet d'interagir avec la base de données MongoDB.
const mongoose = require('mongoose');

// Importation de l'application Express à tester
const app = require('../server');

// Importation du module path pour gérer les chemins de fichiers
const path = require('path');

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

// Bloc de tests pour la route d'inscription
describe('Test de la route register', () => {
	// Test spécifique pour la création d'un utilisateur
	it("devrait retourner 201 si l'utilisateur est créé", async () => {
		// Utilisation de Supertest pour envoyer une requête POST à la route /api/register avec des données de formulaire
		const response = await request(app)
			.post('/api/register')
			// Remplissage des champs du formulaire avec des valeurs simulées
			.field('lastname', 'Doe')
			.field('firstname', 'John')
			.field('birthday', '1990-01-01')
			.field('address', '1 rue de la paix')
			.field('zipcode', '75000')
			.field('city', 'Paris')
			.field('phone', '0606060606')
			.field('email', 'fournier@gmail.com')
			.field('password', '123456')
			// Attache un fichier à la requête, par exemple, une image d'avatar
			.attach('image', path.resolve(__dirname, '../image/avatar.jpg'));

		// Affichage de la réponse reçue dans la console
		console.log('Réponse reçue:', response.body);

		// Assertion vérifiant que le statut de la réponse est 201 (Créé avec succès)
		expect(response.status).toBe(201);

		// Assertion vérifiant que la propriété 'message' de la réponse contient le message attendu
		expect(response.body).toHaveProperty(
			'message',
			'Utilisateur créé avec succès. Vérifiez votre email pour activer votre compte',
		);
	});
});

/*
 beforeAll : C'est un hook de test qui est exécuté avant tous les tests. Il est utilisé ici pour établir une connexion à la base de données.

afterAll : C'est un hook de test qui est exécuté après tous les tests. Il est utilisé ici pour fermer la connexion à la base de données.

beforeEach : C'est un hook de test qui est exécuté avant chaque test. Il est utilisé ici pour nettoyer et réinitialiser la base de données, assurant ainsi que chaque test commence avec une base de données propre.

describe : C'est une fonction de Jest qui permet de regrouper plusieurs tests sous une même description. Dans ce cas, tous les tests liés à la route d'inscription sont regroupés sous la description "Test de la route register".

it : C'est une fonction de Jest qui représente un test individuel. Dans ce cas, le test vérifie si la création d'un utilisateur retourne un statut 201.

.post : C'est une méthode de Supertest utilisée pour envoyer une requête HTTP POST.

.field : C'est une méthode de Supertest utilisée pour envoyer des données de formulaire avec la requête.

.attach : C'est une méthode de Supertest utilisée pour attacher des fichiers à la requête, comme une image d'avatar.

expect : C'est une fonction de Jest utilisée pour faire des assertions dans les tests.

toBeTruthy : C'est une assertion qui vérifie si la valeur est évaluée à true. Dans ce cas, elle est utilisée pour s'assurer que la connexion à la base de données a été établie avec succès.
 */
