import mongoose, { Connection } from 'mongoose';
const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI || '';
let cachedConnection: Connection | null = null;

async function connectDB(): Promise<Connection> {
	if (cachedConnection) {
		return cachedConnection;
	}

	if (!MONGO_URI) {
		throw new Error('MongoDB URI is not defined in environment variables');
	}

	try {
		const connection = await mongoose.connect(MONGO_URI);
		cachedConnection = connection.connection;
		console.log('Connected to MongoDB');
		return cachedConnection;
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw error;
	}
}

export { connectDB };
