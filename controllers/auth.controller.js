// Import du modèle utilisateur
const authModel = require('../models/auth.model');
// Import de la validation des données
const { validationResult } = require('express-validator');

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

		// Vérification de la longueur du mot de passe (exemple : 6 caractères minimum)
		if (password.length < 6) {
			// Vérifie la longueur du mot de passe
			return (
				res
					.status(400)
					// Renvoie une erreur si le mot de passe est trop court
					.json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' })
			);
		}

		// Vérifier si l'email existe déjà dans la base de données
		// Recherche de l'email dans la base de données
		const existingUser = await authModel.findOne({ email });

		if (existingUser) {
			// Vérifie si l'email existe déjà dans la base de données
			return (
				res
					.status(400)
					// Renvoie une erreur si l'email est déjà utilisé
					.json({
						message: 'Cet email est déjà utilisé. Veuillez choisir un autre email.',
					})
			);
		}

		// Créer un nouvel utilisateur (le mot de passe est déjà hashé dans le modèle)
		// Crée un nouvel utilisateur dans la base de données
		const user = await authModel.create({ lastname, firstname, email, password });

		// Renvoie une réponse de succès avec les détails de l'utilisateur créé
		res.status(201).json({ message: 'Utilisateur créé avec succès', user });
	} catch (error) {
		// Renvoie une erreur en cas de problème lors de la création de l'utilisateur
		res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
	}
};
