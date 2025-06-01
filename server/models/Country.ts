import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  scores: {
    infrastructure: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    market: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    workforce: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    regulatory: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    sustainability: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  news: [{
    title: String,
    content: String,
    source: String,
    date: Date,
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    reliability: {
      type: Number,
      min: 0,
      max: 1
    }
  }],
  history: [{
    date: {
      type: Date,
      required: true
    },
    scores: {
      infrastructure: Number,
      market: Number,
      workforce: Number,
      regulatory: Number,
      sustainability: Number
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export const Country = mongoose.model('Country', countrySchema); 