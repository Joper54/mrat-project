import { connectDB } from './config/db';
import { Country } from './models/Country';

const countries = [
  {
    name: 'Nigeria',
    scores: {
      infrastructure: 65,
      market: 75,
      workforce: 70,
      regulatory: 60,
      sustainability: 55
    }
  },
  {
    name: 'Ghana',
    scores: {
      infrastructure: 70,
      market: 65,
      workforce: 75,
      regulatory: 70,
      sustainability: 60
    }
  },
  {
    name: 'South Africa',
    scores: {
      infrastructure: 80,
      market: 85,
      workforce: 80,
      regulatory: 75,
      sustainability: 70
    }
  },
  {
    name: 'Kenya',
    scores: {
      infrastructure: 70,
      market: 70,
      workforce: 75,
      regulatory: 65,
      sustainability: 65
    }
  },
  {
    name: 'Egypt',
    scores: {
      infrastructure: 75,
      market: 80,
      workforce: 70,
      regulatory: 70,
      sustainability: 60
    }
  },
  {
    name: 'Morocco',
    scores: {
      infrastructure: 75,
      market: 75,
      workforce: 70,
      regulatory: 70,
      sustainability: 65
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Country.deleteMany({});
    
    // Insert new data
    await Country.insertMany(countries);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 