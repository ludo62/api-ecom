const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authenticate');
const cloudinaryUpload = require('../middleware/cloudinaryUpload');

// Route pour l'inscription
router.post('/register', cloudinaryUpload, authController.register);

// Route pour la connexion
router.post('/login', authController.login);

// Route pour récuperer tous les utilisateur (admin)
router.get('/users', authMiddleware.authenticate, authController.getAllUsers);

// Route pour récuperer un utilisateur avec son id (admin)
router.get('/user/:id', authMiddleware.authenticate, authController.getUserById);

// Route pour modifier le profil d'un utilisateur (admin)
router.put(
	'/update-user/:id',
	authMiddleware.authenticate,
	cloudinaryUpload,
	authController.updateUser,
);

// Route pour supprimer un utilisateur (admin)
router.delete('/delete-user/:id', authMiddleware.authenticate, authController.deleteUser);

// Route pour voir mon profil
router.get('/profile/:id', authController.getProfile);

// Route pour la modification du profil
router.put('/update/:id', cloudinaryUpload, authController.update);

// Route pour supprimer notre profil
router.delete('/delete/:id', authController.delete);

// Route protegée
router.get('/dashboard', authMiddleware.authenticate, authController.dashboard);

module.exports = router;
