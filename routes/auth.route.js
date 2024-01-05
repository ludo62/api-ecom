const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authenticate');

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion
router.post('/login', authController.login);

// Exemple de route protégée nécessitant une authentification
router.get('/protected-route', authMiddleware.authenticate, (req, res) => {
	// Vérifier si l'utilisateur est un administrateur
	if (req.user.role === 'admin') {
		// Tâches spécifiques pour les administrateurs
		// Ici, je définis req.isAdmin à true pour les administrateurs
		req.isAdmin = true;

		// Envoyer une réponse pour les administrateurs
		return res.status(200).json({ message: 'Bienvenue, administrateur!' });
	} else {
		// Envoyer une réponse pour les utilisateurs non-administrateurs
		return res.status(403).json({
			message: 'Action non autorisée. Seuls les administrateurs ont accès à cette ressource.',
		});
	}
});

module.exports = router;
