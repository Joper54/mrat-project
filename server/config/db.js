import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mrat';
export const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected successfully');
        console.log('MongoDB connection state:', mongoose.connection.readyState);
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('MongoDB connection state:', mongoose.connection.readyState);
        process.exit(1);
    }
};
