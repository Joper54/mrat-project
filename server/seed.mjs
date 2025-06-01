import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Country from './models/Country.js';
import { connectDB } from './config/db.js';

dotenv.config();

const countries = [
  {
    name: 'Nigeria',
    scores: {
      infrastructure: { total: 65 },
      market: { total: 75 },
      workforce: { total: 70 },
      regulatory: { total: 60 },
      sustainability: { total: 55 }
    }
  },
  {
    name: 'Ghana',
    scores: {
      infrastructure: { total: 70 },
      market: { total: 65 },
      workforce: { total: 75 },
      regulatory: { total: 70 },
      sustainability: { total: 60 }
    }
  },
  {
    name: 'South Africa',
    scores: {
      infrastructure: { total: 80 },
      market: { total: 85 },
      workforce: { total: 80 },
      regulatory: { total: 75 },
      sustainability: { total: 70 }
    }
  },
  {
    name: 'Kenya',
    scores: {
      infrastructure: { total: 70 },
      market: { total: 70 },
      workforce: { total: 75 },
      regulatory: { total: 65 },
      sustainability: { total: 65 }
    }
  },
  {
    name: 'Egypt',
    scores: {
      infrastructure: { total: 75 },
      market: { total: 80 },
      workforce: { total: 70 },
      regulatory: { total: 70 },
      sustainability: { total: 60 }
    }
  },
  {
    name: 'Morocco',
    scores: {
      infrastructure: { total: 75 },
      market: { total: 75 },
      workforce: { total: 70 },
      regulatory: { total: 70 },
      sustainability: { total: 65 }
    }
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    await Country.deleteMany({});
    await Country.insertMany(countries);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 