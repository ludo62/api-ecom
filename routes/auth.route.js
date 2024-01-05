const router = require('express').Router();
const authcontroller = require('../controllers/auth.controller');

// Route pour l'inscription
router.post('/register', authcontroller.register);

module.exports = router;
