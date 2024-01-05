require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.route');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Création des routes
app.use('/api', authRoutes);

const corsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
};

app.use(cors(corsOptions));

// Lancement du serveur
const PORT = process.env.PORT;

const start = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
		console.log('DB connected');
	} catch (error) {
		console.log(error);
	}
};
start();
