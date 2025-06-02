import mongoose from 'mongoose';
import axios from 'axios';
import cron from 'node-cron';
import Country from './models/Country.js';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_URL = 'https://newsapi.org/v2/everything';
const MONGODB_URI = process.env.MONGODB_URI;

const countries = [
  { code: 'NGA', name: 'Nigeria' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'ZAF', name: 'South Africa' },
  { code: 'KEN', name: 'Kenya' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'MAR', name: 'Morocco' }
];

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

async function fetchNewsFromNewsAPI(name) {
  try {
    const response = await axios.get(NEWSAPI_URL, {
      params: {
        q: `${name} manufacturing OR economy OR business`,
        apiKey: NEWSAPI_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5
      }
    });
    return (response.data.articles || []).map(article => ({
      title: article.title,
      content: article.description || '',
      source: article.source.name,
      date: article.publishedAt,
      sentiment: 'neutral', // Placeholder, can run Gemini for sentiment
      reliability: 0.8 // Placeholder
    }));
  } catch {
    return [];
  }
}

async function geminiAnalyzeCountry(name, scores) {
  if (!GEMINI_API_KEY) return null;
  try {
    const prompt = `Analyze the following scores for ${name}: ${JSON.stringify(scores)}. Give a summary, sentiment, and key points.`;
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return response.data;
  } catch {
    return null;
  }
}

async function updateAllCountries() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  for (const c of countries) {
    let scores = {};
    const gdp = await fetchWorldBankGDP(c.code);
    if (gdp) {
      scores = {
        infrastructure: { total: Math.round(Math.random() * 4 + 6) },
        regulatory: { total: Math.round(Math.random() * 4 + 6) },
        market: { total: Math.round(gdp / 1e10) },
        workforce: { total: Math.round(Math.random() * 4 + 6) },
        sustainability: { total: Math.round(Math.random() * 4 + 6) }
      };
    } else {
      scores = {
        infrastructure: { total: Math.round(Math.random() * 4 + 6) },
        regulatory: { total: Math.round(Math.random() * 4 + 6) },
        market: { total: Math.round(Math.random() * 4 + 6) },
        workforce: { total: Math.round(Math.random() * 4 + 6) },
        sustainability: { total: Math.round(Math.random() * 4 + 6) }
      };
    }
    const analysis = await geminiAnalyzeCountry(c.name, scores);
    const news = await fetchNewsFromNewsAPI(c.name);
    await Country.updateOne(
      { name: c.name },
      {
        $set: {
          scores,
          analysis,
          news,
          lastUpdated: new Date()
        },
        $push: {
          history: { date: new Date(), scores }
        }
      },
      { upsert: true }
    );
    console.log(`Updated ${c.name}`);
  }
  await mongoose.disconnect();
  console.log('All countries updated.');
}

// Schedule to run every 24 hours
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled country data/news update...');
  updateAllCountries();
});

// Allow manual run
if (process.argv.includes('--run')) {
  updateAllCountries().then(() => process.exit(0));
} 