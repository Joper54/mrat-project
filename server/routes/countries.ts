import express from 'express';
import { Country } from '../models/Country.js';

const router = express.Router();

// Get all countries with their scores
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find().select('name scores');
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries', error });
  }
});

// Get a specific country with all details
router.get('/:name', async (req, res) => {
  try {
    const country = await Country.findOne({ name: req.params.name });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching country', error });
  }
});

// Update country scores
router.put('/:name/scores', async (req, res) => {
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
    res.status(500).json({ message: 'Error updating country scores', error });
  }
});

// Add news to a country
router.post('/:name/news', async (req, res) => {
  try {
    const country = await Country.findOne({ name: req.params.name });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    country.news.push(req.body);
    await country.save();
    res.json(country);
  } catch (error) {
    res.status(500).json({ message: 'Error adding news', error });
  }
});

export default router; 