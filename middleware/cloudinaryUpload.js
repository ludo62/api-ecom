const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configuration de Multer pour stocker les images dans la mémoire temporaire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cloudinaryUpload = async (req, res, next) => {
	try {
		console.log('Début du middleware cloudinaryUpload');

		// Utilisation de Multer pour gérer le fichier depuis la requête
		upload.single('image')(req, res, async (err) => {
			console.log('Multer a terminé de gérer le fichier');

			// Gestion des erreurs Multer
			if (err) {
				console.error('Erreur lors du téléversement avec Multer :', err);
				return res
					.status(500)
					.json({ message: 'Erreur lors du téléversement avec Multer' });
			}

			// Vérification de l'existence du fichier dans la requête
			if (!req.file) {
				return res.status(400).json({ message: 'Veuillez télécharger une image' });
			}

			try {
				console.log('Début du téléversement sur Cloudinary');

				// Utilisation de Cloudinary pour téléverser l'image
				const result = await cloudinary.uploader
					.upload_stream((error, result) => {
						// Gestion des erreurs Cloudinary
						if (error) {
							console.error('Erreur lors du téléversement sur Cloudinary :', error);
							return res
								.status(500)
								.json({ message: 'Erreur lors du téléversement sur Cloudinary' });
						}

						console.log('Téléversement sur Cloudinary réussi');
						// Ajout de l'URL de l'image de Cloudinary à la requête
						req.cloudinaryUrl = result.secure_url;
						// Passe à la prochaine étape du middleware ou à la route
						next();
					})
					.end(req.file.buffer);

				console.log('Fin du middleware cloudinaryUpload');
			} catch (cloudinaryError) {
				console.error('Erreur lors du téléversement sur Cloudinary :', cloudinaryError);
				res.status(500).json({ message: 'Erreur lors du téléversement sur Cloudinary' });
			}
		});
	} catch (error) {
		console.error('Erreur non traitée dans le middleware cloudinaryUpload :', error);
		res.status(500).json({ message: 'Erreur non traitée dans le middleware cloudinaryUpload' });
	}
};

module.exports = cloudinaryUpload;
