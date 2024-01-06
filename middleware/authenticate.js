// Middleware d'authentification
const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');

module.exports.authenticate = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res
				.status(401)
				.json({
					message:
						"Vous devez être connecté en tant qu'administrateur pour accéder à cette ressource",
				});
		}

		// Extraction du token sans le préfixe "Bearer"
		const token = authHeader.split(' ')[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await authModel.findById(decoded.user.id);

		if (!user) {
			return res.status(401).json({ message: 'Utilisateur non trouvé' });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Erreur lors de l'authentification :", error.message);
		res.status(500).json({ message: "Erreur lors de l'authentification", error });
	}
};
