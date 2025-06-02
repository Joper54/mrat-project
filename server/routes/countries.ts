import express from 'express';
import Country from '../models/Country.js';

const router = express.Router();

// Get all countries with their scores, news, analysis, lastUpdated
router.get('/', async (req, res, next) => {
  try {
    const countries = await Country.find().select('name scores news analysis lastUpdated');
    res.json(countries);
  } catch (error) {
    next(error);
  }
});

// Get a specific country with all details
router.get('/:name', async (req, res, next) => {
  try {
    const country = await Country.findOne({ name: req.params.name });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    next(error);
  }
});

// Get only the analysis for a country
router.get('/:name/analysis', async (req, res, next) => {
  try {
    const country = await Country.findOne({ name: req.params.name }).select('analysis');
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(country.analysis);
  } catch (error) {
    next(error);
  }
});

// Update country scores
router.put('/:name/scores', async (req, res, next) => {
  try {
    const country = await Country.findOne({ name: req.params.name });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    country.scores = req.body.scores;
    country.history.push({
      date: new Date(),
      scores: req.body.scores
    });
    country.lastUpdated = new Date();

    await country.save();
    res.json(country);
  } catch (error) {
    next(error);
  }
});

// Add news to a country
router.post('/:name/news', async (req, res, next) => {
  try {
    const country = await Country.findOne({ name: req.params.name });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    country.news.push(req.body);
    await country.save();
    res.json(country);
  } catch (error) {
    next(error);
  }
});

export default router; 