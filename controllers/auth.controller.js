// Import du modèle utilisateur
const authModel = require('../models/auth.model');
// Import de la validation des données
const { validationResult } = require('express-validator');
// Import du module de hachage bcrypt
const bcrypt = require('bcrypt');
// Import du module jwt pour les tokens JWT
const jwt = require('jsonwebtoken');

// Fonction pour l'inscription
module.exports.register = async (req, res) => {
	try {
		// Validation des données d'entrée
		// Récupération des erreurs de validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Vérifie s'il y a des erreurs de validation
			// Renvoie les erreurs de validation
			return res.status(400).json({ errors: errors.array() });
		}

		// Récupération des données du formulaire
		const { lastname, firstname, email, password } = req.body;

		// Vérification de la longueur du mot de passe (6 caractères minimum)
		if (password.length < 6) {
			// Vérifie la longueur du mot de passe
			// Renvoie une erreur si le mot de passe est trop court
			return res
				.status(400)
				.json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
		}

		// Vérifier si l'email existe déjà dans la base de données
		const existingUser = await authModel.findOne({ email });

		if (existingUser) {
			// Vérifie si l'email existe déjà dans la base de données
			// Renvoie une erreur si l'email est déjà utilisé
			return res
				.status(400)
				.json({ message: 'Cet email est déjà utilisé. Veuillez choisir un autre email.' });
		}

		// Créer un nouvel utilisateur (le mot de passe est déjà hashé dans le modèle)
		const user = await authModel.create({ lastname, firstname, email, password });

		// Renvoie une réponse de succès avec les détails de l'utilisateur créé
		res.status(201).json({ message: 'Utilisateur créé avec succès', user });
	} catch (error) {
		// Renvoie une erreur en cas de problème lors de la création de l'utilisateur
		res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
	}
};

// Fonction pour la connexion
module.exports.login = async (req, res) => {
	try {
		// Validation des données d'entrée
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		// Vérifier si l'utilisateur existe dans la base de données
		const user = await authModel.findOne({ email });

		if (!user) {
			console.log('Utilisateur non trouvé');
			return res.status(401).json({ message: 'Identifiants invalides' });
		}

		// Vérification du mot de passe
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			console.log('Mot de passe incorrect');
			return res.status(401).json({ message: 'Identifiants invalides' });
		}

		console.log('Connexion réussie');

		// Création du token JWT
		const payload = {
			user: {
				id: user._id,
				email: user.email,
				// Aucun besoin de gérer explicitement le rôle ici
			},
		};

		const secretKey = process.env.JWT_SECRET;
		const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

		// Renvoie un message et le token JWT pour l'authentification ultérieure
		res.status(200).json({ message: 'Connexion réussie', token });
	} catch (error) {
		console.error('Erreur lors de la connexion :', error.message);
		res.status(500).json({ message: 'Erreur lors de la connexion' });
	}
};
