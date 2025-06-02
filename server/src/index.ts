import express from 'express';
import cors from 'cors';
import { clientPromise } from './config.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize MongoDB connection
let db: any;
clientPromise.then((client) => {
  db = client.db('mrat');
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
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
    
    const prompt = `Generate 5 recent news headlines and descriptions about ${req.params.countryCode}. 
    Format the response as a JSON array with objects containing title, description, url, publishedAt, and source.name fields.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const news = JSON.parse(text);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 