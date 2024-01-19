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

test('should connect to the database', async () => {
	// The connection is established if this test passes
	const isConnected = mongoose.connection.readyState === 1;
	expect(isConnected).toBeTruthy();
});
