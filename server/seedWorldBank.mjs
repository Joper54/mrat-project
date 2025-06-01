import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Country from './models/Country.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const countries = [
  { code: 'NGA', name: 'Nigeria' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'ZAF', name: 'South Africa' },
  { code: 'KEN', name: 'Kenya' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'MAR', name: 'Morocco' }
];

async function fetchGDP() {
  const codes = countries.map(c => c.code).join(';');
  const indicator = 'NY.GDP.MKTP.CD';
  const url = `http://api.worldbank.org/v2/country/${codes}/indicator/${indicator}?format=json&date=2022`;
  const response = await axios.get(url);
  return response.data[1];
}

function randomScore() {
  return Math.round(Math.random() * 40 + 60); // 60-100
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const gdpData = await fetchGDP();
  const gdpMap = {};
  for (const entry of gdpData) {
    gdpMap[String(entry.country.id)] = entry.value;
  }

  for (const c of countries) {
    await Country.updateOne(
      { name: c.name },
      {
        $set: {
          name: c.name,
          scores: {
            infrastructure: { total: randomScore() },
            market: { total: randomScore() },
            workforce: { total: randomScore() },
            regulatory: { total: randomScore() },
            sustainability: { total: randomScore() }
          },
          lastUpdated: new Date()
        },
        $push: {
          history: {
            date: new Date(),
            scores: {
              infrastructure: { total: randomScore() },
              market: { total: randomScore() },
              workforce: { total: randomScore() },
              regulatory: { total: randomScore() },
              sustainability: { total: randomScore() }
            }
          }
        }
      },
      { upsert: true }
    );
    console.log(`Seeded data for ${c.name} (GDP: ${gdpMap[c.code]})`);
  }

  await mongoose.disconnect();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
}); 