import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Country from './models/Country.js';

dotenv.config();

const GEMINI_API_KEY = 'AIzaSyA3ZCnyB01g776rPPLUABmuzQTB_h-bU6s';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const NEWSAPI_KEY = 'b7e0e6e2e6e94e1c8e6e2e6e94e1c8e6'; // Replace with your actual NewsAPI key if different
const NEWSAPI_URL = 'https://newsapi.org/v2/everything';

const MONGODB_URI = process.env.MONGODB_URI || '';
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

async function geminiAnalyzeCountry(name, scores) {
  try {
    const prompt = `Analyze the following country scores for ${name} and provide a short summary and sentiment (positive, neutral, or negative):\n${JSON.stringify(scores)}`;
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Try to extract sentiment if present
    let sentiment = 'neutral';
    if (/positive/i.test(text)) sentiment = 'positive';
    else if (/negative/i.test(text)) sentiment = 'negative';
    return { summary: text, sentiment };
  } catch (err) {
    return { summary: 'No analysis available', sentiment: 'neutral' };
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
        pageSize: 3
      }
    });
    return (response.data.articles || []).map(article => ({
      title: article.title,
      summary: article.description || '',
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name
    }));
  } catch {
    return [];
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
    // Gemini analysis
    const analysis = await geminiAnalyzeCountry(c.name, scores);
    // NewsAPI news
    const news = await fetchNewsFromNewsAPI(c.name);
    await Country.replaceOne(
      { name: c.name },
      {
        name: c.name,
        scores,
        analysis,
        news,
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