import express from 'express';
import cors from 'cors';
import { clientPromise } from './config.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { instructor, VisualizationRequestSchema, VisualizationResponseSchema } from './types.js';
import { initializeDatabase, storeMetrics, getMetricsForVisualization } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize MongoDB and TimescaleDB
let db: any;
Promise.all([
  clientPromise.then((client) => {
    db = client.db('mrat');
    console.log('Connected to MongoDB');
  }),
  initializeDatabase().then(() => {
    console.log('TimescaleDB initialized');
  })
]).catch((err) => {
  console.error('Failed to initialize databases:', err);
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get all countries
app.get('/api/countries', async (req, res) => {
  try {
    const countries = await db.collection('countries').find({}).toArray();
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Get country by code
app.get('/api/countries/:code', async (req, res) => {
  try {
    const country = await db.collection('countries').findOne({ code: req.params.code });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({ error: 'Failed to fetch country' });
  }
});

// Get news for a country using Gemini AI
app.get('/api/news/:countryCode', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate 5 recent news headlines and descriptions about ${req.params.countryCode}. Each item should be a JSON object with: title, description, url, publishedAt, and source.name. Return a valid JSON array only, with no extra text.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON, fallback to empty array if invalid
    let news = [];
    try {
      news = JSON.parse(text);
      if (!Array.isArray(news)) throw new Error('Not an array');
    } catch (e) {
      console.error('Gemini returned invalid JSON:', text);
      return res.json({ articles: [] });
    }
    res.json({ articles: news });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Update country scores
app.put('/api/countries/:code/scores', async (req, res) => {
  try {
    const { scores } = req.body;
    const result = await db.collection('countries').updateOne(
      { code: req.params.code },
      { $set: { scores } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({ message: 'Scores updated successfully' });
  } catch (error) {
    console.error('Error updating scores:', error);
    res.status(500).json({ error: 'Failed to update scores' });
  }
});

// Enhanced Gemini insights endpoint with TimescaleDB integration
app.post('/api/gemini/insights', async (req, res) => {
  try {
    const request = VisualizationRequestSchema.parse(req.body);
    const countries = [
      { code: 'NGA', country: 'Nigeria' },
      { code: 'GHA', country: 'Ghana' },
      { code: 'ZAF', country: 'South Africa' },
      { code: 'KEN', country: 'Kenya' },
      { code: 'EGY', country: 'Egypt' },
      { code: 'MAR', country: 'Morocco' }
    ];
    const indicators = {
      gdp: 'NY.GDP.MKTP.CD',
      population: 'SP.POP.TOTL',
      unemployment: 'SL.UEM.TOTL.ZS',
      school_enrollment: 'SE.SEC.ENRR',
      life_expectancy: 'SP.DYN.LE00.IN',
      electricity_access: 'EG.ELC.ACCS.ZS',
      co2_emissions: 'EN.ATM.CO2E.PC'
    };

    async function fetchWorldBankData(countryCode: string, indicatorCode: string): Promise<number | null> {
      const url = `http://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=100`;
      const res = await fetch(url);
      const data = await res.json();
      if (data[1]) {
        for (const entry of data[1]) {
          if (entry.value !== null) {
            return entry.value;
          }
        }
      }
      return null;
    }

    // Gather data for all countries
    const countryData: Array<Record<string, string | number | null>> = [];
    for (const c of countries) {
      const entry: Record<string, string | number | null> = { country: c.country };
      const metrics: Record<string, number | null> = {};
      
      for (const [key, code] of Object.entries(indicators)) {
        const value = await fetchWorldBankData(c.code, code);
        entry[key] = value;
        metrics[key] = value;
      }
      
      countryData.push(entry);
      // Store metrics in TimescaleDB
      await storeMetrics(c.code, metrics);
    }

    // Get historical data if requested
    let historicalData = [];
    if (request.filters?.time_range) {
      const [start, end] = request.filters.time_range.split(',');
      historicalData = await getMetricsForVisualization(
        new Date(start),
        new Date(end),
        [request.y_axis],
        countries.map(c => c.code)
      );
    }

    // Use Instructor to generate structured response
    const prompt = `Analyze the following data and create a visualization response:
    Question: ${request.question}
    Current Data: ${JSON.stringify(countryData)}
    ${historicalData.length ? `Historical Data: ${JSON.stringify(historicalData)}` : ''}
    Visualization Type: ${request.visualization_type}
    X-Axis: ${request.x_axis}
    Y-Axis: ${request.y_axis}
    Please provide insights and recommendations based on the data.`;

    const response = await instructor.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
    });

    const visualizationResponse = VisualizationResponseSchema.parse(response.choices[0].message.content);
    res.json({
      ...visualizationResponse,
      historicalData: historicalData.length ? historicalData : undefined
    });
  } catch (error) {
    console.error('Error in Gemini insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 