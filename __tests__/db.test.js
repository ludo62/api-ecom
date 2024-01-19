const mongoose = require('mongoose');
require('dotenv').config();

/* Connecting to the database before all tests. */
beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_URI);
});

/* Closing database connection after all tests. */
afterAll(async () => {
	await mongoose.connection.close();
});

test('connection to the database', async () => {
	console.log('connexion à la base de données réussie');
});
