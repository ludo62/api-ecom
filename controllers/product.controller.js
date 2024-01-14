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
		if (!req.cloudinaryUrl || !req.file) {
			return res.status(400).json({ message: 'Veuillez télécharger une image' });
		}

		// Déclaration de variable pour récupérer l'id de l'utilisateur qui va poster un produit
		const userId = req.user._id;

		// Utilisation de l'URL de Cloudinary et du public_id provenant du middleware
		const imageUrl = req.cloudinaryUrl;
		const imagePublicId = req.file.public_id; // Use public_id from the file object

		// Création d'un produit avec le public_id de l'image sur Cloudinary
		const newProduct = await productModel.create({
			title,
			description,
			price,
			imageUrl,
			imagePublicId,
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

		// Check if a new image is uploaded
		if (req.file) {
			// Delete the existing image on Cloudinary
			if (existingProduct.imagePublicId) {
				await cloudinary.uploader.destroy(existingProduct.imagePublicId);
			}

			// Set the new image URL and public ID
			existingProduct.imageUrl = req.cloudinaryUrl;
			existingProduct.imagePublicId = req.file.public_id; // Use public_id from the file object
		}

		// Save the modifications to the database
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
		// Check if the user is an admin
		if (req.user.role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'Action non autorisée. Seul un admin peut supprimer un produit' });
		}

		// Get the product ID from the request parameters
		const productId = req.params.id;

		// Retrieve the product to get the image URL on Cloudinary
		const product = await productModel.findById(productId);

		// Check if the product is not found
		if (!product) {
			return res.status(404).json({ message: 'Produit non trouvé' });
		}

		// Get the image ID on Cloudinary
		const imagePublicId = product.imagePublicId;

		// Delete the product
		const deletedProduct = await productModel.findByIdAndDelete(productId);

		// Check if the product is not found after deletion
		if (!deletedProduct) {
			return res.status(404).json({ message: 'Produit non trouvé' });
		}

		// Log to verify the image ID
		console.log('Image Public ID:', imagePublicId);

		// Log to verify if the deletion is called
		console.log('produit supprimé avec succès');

		// Delete the image on Cloudinary
		if (imagePublicId) {
			await cloudinary.uploader.destroy(imagePublicId);
			console.log('Image supprimée de Cloudinary avec succès');
		}

		res.status(200).json({ message: 'Produit supprimé avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression du produit :', error.message);
		res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
	}
};
