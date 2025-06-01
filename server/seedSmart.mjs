import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
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

const AIML_API_KEY = process.env.VITE_AIML_API_KEY || process.env.AIML_API_KEY || '0ee9fcb0dc9c48eb95f182c2908da717';
const AIML_BASE_URL = process.env.VITE_AIML_API_URL || process.env.AIML_API_URL || 'https://api.aimlapi.com/v1';

const aimlApi = axios.create({
  baseURL: AIML_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AIML_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

async function fetchWorldBankGDP(code) {
  try {
    const indicator = 'NY.GDP.MKTP.CD';
    const url = `http://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json&date=2022`;
    const response = await axios.get(url);
    const data = response.data[1];
    return data && data[0] && data[0].value ? data[0].value : null;
  } catch {
    return null;
  }
}

async function fetchAIMLData(name) {
  try {
    const response = await aimlApi.get(`/countries/${name}`);
    const d = response.data;
    return {
      infrastructure: { total: d.infrastructure?.total || 0 },
      regulatory: { total: d.regulatory?.total || 0 },
      market: { total: d.market_demand?.total || 0 },
      workforce: { total: d.workforce?.total || 0 },
      sustainability: { total: d.sustainability?.total || 0 }
    };
  } catch {
    return null;
  }
}

async function fetchNewsAnalysis(name) {
  try {
    const response = await aimlApi.get(`/news/${name}`);
    const data = response.data;
    return {
      sentiment: data.sentiment || 'neutral',
      summary: data.summary || 'No summary available'
    };
  } catch {
    return null;
  }
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  await Country.deleteMany({});
  console.log('Cleared Country collection');

  for (const c of countries) {
    let scores = {};
    // Try World Bank GDP (as a proxy for market)
    const gdp = await fetchWorldBankGDP(c.code);
    if (gdp) {
      scores = {
        infrastructure: { total: Math.round(Math.random() * 40 + 60) },
        regulatory: { total: Math.round(Math.random() * 40 + 60) },
        market: { total: Math.round(gdp / 1e10) },
        workforce: { total: Math.round(Math.random() * 40 + 60) },
        sustainability: { total: Math.round(Math.random() * 40 + 60) }
      };
      console.log(`Seeded ${c.name} from World Bank`);
    } else {
      // Fallback to AIML API
      const aimlScores = await fetchAIMLData(c.name);
      if (aimlScores) {
        scores = aimlScores;
        console.log(`Seeded ${c.name} from AIML API`);
      } else {
        // Fallback to random
        scores = {
          infrastructure: { total: Math.round(Math.random() * 40 + 60) },
          regulatory: { total: Math.round(Math.random() * 40 + 60) },
          market: { total: Math.round(Math.random() * 40 + 60) },
          workforce: { total: Math.round(Math.random() * 40 + 60) },
          sustainability: { total: Math.round(Math.random() * 40 + 60) }
        };
        console.log(`Seeded ${c.name} with random data`);
      }
    }
    // Fetch news analysis
    const newsAnalysis = await fetchNewsAnalysis(c.name);
    await Country.replaceOne(
      { name: c.name },
      {
        name: c.name,
        scores,
        newsAnalysis,
        history: [{ date: new Date(), scores }],
        lastUpdated: new Date()
      },
      { upsert: true }
    );
  }
  await mongoose.disconnect();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
}); 