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

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const scoreSchema = new mongoose.Schema({
  country: String,
  date: Date,
  scores: {
    infrastructure: Number,
    workforce: Number,
    technology: Number,
    supply_chain: Number,
    innovation: Number
  },
  total_score: Number,
  rank: Number,
  news: [{
    title: String,
    url: String,
    source: String,
    published_at: Date,
    summary: String
  }]
});

const Score = mongoose.model('Score', scoreSchema);

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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 