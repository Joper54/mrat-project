import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:3001/mrat';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!GEMINI_API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export { clientPromise, GEMINI_API_KEY }; 