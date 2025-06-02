import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  total: { type: Number, required: true }
}, { _id: false });

const historySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  scores: {
    infrastructure: scoreSchema,
    market: scoreSchema,
    workforce: scoreSchema,
    regulatory: scoreSchema,
    sustainability: scoreSchema
  }
}, { _id: false });

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  scores: {
    infrastructure: scoreSchema,
    market: scoreSchema,
    workforce: scoreSchema,
    regulatory: scoreSchema,
    sustainability: scoreSchema
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
  history: [historySchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  analysis: {
    type: mongoose.Schema.Types.Mixed
  }
});

const Country = mongoose.model('Country', countrySchema);
export default Country; 