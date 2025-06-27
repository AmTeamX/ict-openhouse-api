// src/db/connection.ts

import mongoose from 'mongoose';

// Define your MongoDB connection URI
// IMPORTANT: Replace 'your_mongodb_uri' with your actual MongoDB connection string.
// For a local MongoDB instance, it might look like 'mongodb://localhost:27017/your_database_name'
// For MongoDB Atlas, it will be a longer string including credentials.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elysia_test_db';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Logs success or error messages to the console.
 * Exits the process if connection fails.
 */
export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Exit the process if connection fails, as the app won't function without DB
        process.exit(1);
    }
}

/**
 * Disconnects from the MongoDB database.
 * Logs success or error messages to the console.
 */
export async function disconnectDB(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}

