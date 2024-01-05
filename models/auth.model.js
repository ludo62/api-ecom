const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
	lastname: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: {
			validator: (value) => validator.isEmail(value),
			message: 'Adresse e-mail invalide',
		},
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

// Hashage du mot de passe avant de sauvegarder l'utilisateur dans la base de données
userSchema.pre('save', async function (next) {
	try {
		if (!this.isModified('password')) {
			return next();
		}
		const hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		return next();
	} catch (error) {
		return next(error);
	}
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw new Error(error);
	}
};

const User = mongoose.model('User', userSchema);

module.exports = User;
