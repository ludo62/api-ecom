const productModel = require('../models/product.model');
const cloudinary = require('cloudinary').v2;

// Fonction pour créer un produit (accessible seulement par l'administrateur)
module.exports.createProduct = async (req, res) => {
	try {
		// Verifier si l'utilisateur est admin
		if (req.user.role !== 'admin') {
			// Retour d'un message d'erreur
			return res
				.status(403)
				.json({ message: 'Action non autorisée. Seul un admin peut créer un produit' });
		}

		// Récupération des données du formulaire
		const { title, description, price } = req.body;

		// Vérification si une image est téléchargée
		if (!req.cloudinaryUrl) {
			return res.status(400).json({ message: 'Veuillez télécharger une image' });
		}

		// Déclaration de variable pour récupérer l'id de l'utilisateur qui va poster un produit
		const userId = req.user._id;

		// Création d'un produit
		const newProduct = await productModel.create({
			title,
			description,
			price,
			// Utilisation de l'URL de Cloudinary
			imageUrl: req.cloudinaryUrl,
			createdBy: userId,
		});

		res.status(200).json({ message: 'Produit ajouté avec succès', product: newProduct });
	} catch (error) {
		console.error('Erreur lors de la création du produit :', error.message);
		res.status(500).json({ message: 'Erreur lors de la création du produit' });
	}
};

// Fonction pour récuperer tous les produits
module.exports.getAllProducts = async (req, res) => {
	try {
		// Recupération de tous les produits
		const products = await productModel.find();
		// Réponse de succès
		res.status(200).json({ message: 'Liste des produits', products });
	} catch (error) {
		console.error('Erreur lors de la récupération des produits : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
	}
};

// Fonction qui va permettre de récuperer un seul produit avec son id
module.exports.getProductById = async (req, res) => {
	try {
		// Déclaration de la variable qui va rechercher l'id du produit
		const productId = req.params.id;

		// Récupération du produit par son id
		const product = await productModel.findById(productId);

		// Condition si le produit est introuvable
		if (!product) {
			return res.status(404).json({ message: 'Produit non trouvé' });
		}
		res.status(200).json({ message: 'Produit récuperé avec succès', product });
	} catch (error) {
		console.error('Erreur lors de la récupération du produit : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
	}
};

// Fonction pour modifier un produit avec son id (accessible seulement par l'administrateur)
module.exports.updateProduct = async (req, res) => {
	try {
		if (req.user.role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'Action non autorisée. Seul un admin peut supprimer un produit' });
		}

		const productId = req.params.id;
		const existingProduct = await productModel.findById(productId);

		if (!existingProduct) {
			return res.status(404).json({ message: 'Produit non trouvé' });
		}

		existingProduct.title = req.body.title || existingProduct.title;
		existingProduct.description = req.body.description || existingProduct.description;
		existingProduct.price = req.body.price || existingProduct.price;

		// Supprimer l'ancienne image de Cloudinary (si elle existe)
		if (existingProduct.imageUrl) {
			const publicId = existingProduct.imageUrl.split('/').pop().split('.')[0];
			await cloudinary.uploader.destroy(publicId);
		}

		// Mettre à jour l'URL de l'image avec la nouvelle URL de Cloudinary
		if (req.cloudinaryUrl) {
			console.log("Nouvelle URL de l'image :", req.cloudinaryUrl);
			existingProduct.imageUrl = req.cloudinaryUrl;
		}

		// Enregistrez les modifications dans la base de données
		const updatedProduct = await existingProduct.save();

		res.status(200).json({
			message: 'Produit mis à jour avec succès',
			product: updatedProduct,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
	}
};

// Fonction pour suppimer un produit avec son id (accessible seulement par l'administrateur)
module.exports.deleteProduct = async (req, res) => {
	try {
		// Verifier si l'utilisateur est admin
		if (req.user.role !== 'admin') {
			// Retour d'un message d'erreur
			return res
				.status(403)
				.json({ message: 'Action non autorisée. Seul un admin peut supprimer un produit' });
		}
		// Récuperation de l'id du produit
		const productId = req.params.id;

		// Suppression du produit
		const deletedProduct = await productModel.findByIdAndDelete(productId);

		// Condition si le produit est introuvable
		if (!deletedProduct) {
			return res.status(404).json({ message: 'Produit non trouvé' });
		}

		res.status(200).json({ message: 'Produit supprimé avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression du produit : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
	}
};
