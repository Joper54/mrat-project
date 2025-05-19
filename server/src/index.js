import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://joelsaarelainen:cbHEnuaylnWoHmJQ@cluster0.tcglbjj.mongodb.net/mrat?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const scoreSchema = new mongoose.Schema({
  country: String,
  date: { type: Date, default: Date.now },
  scores: {
    infrastructure: {
      road_rail_index: Number,
      energy_reliability: Number,
      port_performance: Number,
      total: Number
    },
    regulatory: {
      doing_business_score: Number,
      import_export_procedures: Number,
      legal_predictability: Number,
      total: Number
    },
    market_demand: {
      manufacturing_gdp: Number,
      industrial_growth: Number,
      active_projects: Number,
      total: Number
    },
    stability: {
      inflation_volatility: Number,
      fdi_flows: Number,
      political_stability: Number,
      total: Number
    },
    partnership: {
      local_firms: Number,
      skilled_labor: Number,
      ppp_openness: Number,
      total: Number
    }
  },
  weights: {
    infrastructure: { type: Number, default: 25 },
    regulatory: { type: Number, default: 20 },
    market_demand: { type: Number, default: 25 },
    stability: { type: Number, default: 15 },
    partnership: { type: Number, default: 15 }
  },
  total_score: Number,
  rank: Number,
  news: [{
    title: String,
    url: String,
    source: String,
    published_at: Date,
    summary: String,
    sentiment: String,
    category: String
  }],
  last_updated: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Helper function to calculate total scores
const calculateScores = (scores) => {
  const weights = {
    infrastructure: 25,
    regulatory: 20,
    market_demand: 25,
    stability: 15,
    partnership: 15
  };

  // Calculate category totals
  Object.keys(scores).forEach(category => {
    if (category !== 'weights' && category !== 'total_score' && category !== 'rank') {
      const categoryScores = scores[category];
      if (typeof categoryScores === 'object' && categoryScores !== null) {
        const values = Object.values(categoryScores).filter(v => typeof v === 'number');
        scores[category].total = values.reduce((a, b) => a + b, 0) / values.length;
      }
    }
  });

  // Calculate weighted total
  const totalScore = (
    scores.infrastructure.total * weights.infrastructure +
    scores.regulatory.total * weights.regulatory +
    scores.market_demand.total * weights.market_demand +
    scores.stability.total * weights.stability +
    scores.partnership.total * weights.partnership
  ) / 100;

  return totalScore;
};

// API Routes
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ total_score: -1 });
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

app.get('/api/scores/:country/history', async (req, res) => {
  try {
    const { country } = req.params;
    const history = await Score.find({ country })
      .sort({ date: 1 })
      .select('date scores total_score');
    res.json(history);
  } catch (error) {
    console.error('Error fetching country history:', error);
    res.status(500).json({ error: 'Failed to fetch country history' });
  }
});

// Add new score
app.post('/api/scores', async (req, res) => {
  try {
    const scoreData = req.body;
    scoreData.total_score = calculateScores(scoreData.scores);
    
    const score = new Score(scoreData);
    await score.save();
    
    // Update ranks
    const allScores = await Score.find().sort({ total_score: -1 });
    for (let i = 0; i < allScores.length; i++) {
      allScores[i].rank = i + 1;
      await allScores[i].save();
    }
    
    res.status(201).json(score);
  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).json({ error: 'Failed to add score' });
  }
});

// Update score
app.put('/api/scores/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const updateData = req.body;
    updateData.total_score = calculateScores(updateData.scores);
    
    const score = await Score.findOneAndUpdate(
      { country },
      updateData,
      { new: true }
    );
    
    if (!score) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    // Update ranks
    const allScores = await Score.find().sort({ total_score: -1 });
    for (let i = 0; i < allScores.length; i++) {
      allScores[i].rank = i + 1;
      await allScores[i].save();
    }
    
    res.json(score);
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 