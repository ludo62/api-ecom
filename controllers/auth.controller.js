const authModel = require('../models/auth.model');
const { validationResult } = require('express-validator');

// Fonction pour l'inscription
module.exports.register = async (req, res) => {
	try {
		// Validation des données d'entrée
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { lastname, firstname, email, password } = req.body;

		// Vérification de la longueur du mot de passe (par exemple, 6 caractères minimum)
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
		}

		// Vérifier si l'email existe déjà dans la base de données
		const existingUser = await authModel.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ message: 'Cet email est déjà utilisé. Veuillez choisir un autre email.' });
		}

		// Créer un nouvel utilisateur (le mot de passe est déjà hashé dans le modèle)
		const user = await authModel.create({ lastname, firstname, email, password });

		res.status(201).json({ message: 'Utilisateur créé avec succès', user });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
	}
};
