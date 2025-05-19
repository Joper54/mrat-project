import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = 'mongodb+srv://joelsaarelainen:cbHEnuaylnWoHmJQ@cluster0.tcglbjj.mongodb.net/mrat?retryWrites=true&w=majority&appName=Cluster0';

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
  news: [],
  last_updated: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

const initialData = [
  {
    country: 'Nigeria',
    scores: {
      infrastructure: {
        road_rail_index: 4.5,
        energy_reliability: 3.0,
        port_performance: 4.0,
        total: 3.8
      },
      regulatory: {
        doing_business_score: 3.5,
        import_export_procedures: 3.0,
        legal_predictability: 3.5,
        total: 3.3
      },
      market_demand: {
        manufacturing_gdp: 8.0,
        industrial_growth: 7.5,
        active_projects: 8.0,
        total: 7.8
      },
      stability: {
        inflation_volatility: 4.0,
        fdi_flows: 6.5,
        political_stability: 4.5,
        total: 5.0
      },
      partnership: {
        local_firms: 7.0,
        skilled_labor: 6.0,
        ppp_openness: 6.5,
        total: 6.5
      }
    }
  },
  {
    country: 'Ghana',
    scores: {
      infrastructure: {
        road_rail_index: 5.0,
        energy_reliability: 4.5,
        port_performance: 5.5,
        total: 5.0
      },
      regulatory: {
        doing_business_score: 6.0,
        import_export_procedures: 5.5,
        legal_predictability: 6.0,
        total: 5.8
      },
      market_demand: {
        manufacturing_gdp: 5.5,
        industrial_growth: 6.0,
        active_projects: 5.0,
        total: 5.5
      },
      stability: {
        inflation_volatility: 5.5,
        fdi_flows: 6.0,
        political_stability: 7.0,
        total: 6.2
      },
      partnership: {
        local_firms: 5.5,
        skilled_labor: 5.0,
        ppp_openness: 6.0,
        total: 5.5
      }
    }
  },
  {
    country: 'South Africa',
    scores: {
      infrastructure: {
        road_rail_index: 7.0,
        energy_reliability: 4.0,
        port_performance: 7.5,
        total: 6.2
      },
      regulatory: {
        doing_business_score: 6.5,
        import_export_procedures: 6.0,
        legal_predictability: 6.5,
        total: 6.3
      },
      market_demand: {
        manufacturing_gdp: 6.5,
        industrial_growth: 5.0,
        active_projects: 6.0,
        total: 5.8
      },
      stability: {
        inflation_volatility: 5.0,
        fdi_flows: 6.5,
        political_stability: 5.5,
        total: 5.7
      },
      partnership: {
        local_firms: 7.0,
        skilled_labor: 7.5,
        ppp_openness: 6.5,
        total: 7.0
      }
    }
  },
  {
    country: 'Kenya',
    scores: {
      infrastructure: {
        road_rail_index: 5.5,
        energy_reliability: 4.5,
        port_performance: 5.0,
        total: 5.0
      },
      regulatory: {
        doing_business_score: 6.0,
        import_export_procedures: 5.5,
        legal_predictability: 5.5,
        total: 5.7
      },
      market_demand: {
        manufacturing_gdp: 6.0,
        industrial_growth: 6.5,
        active_projects: 6.0,
        total: 6.2
      },
      stability: {
        inflation_volatility: 5.5,
        fdi_flows: 6.0,
        political_stability: 6.0,
        total: 5.8
      },
      partnership: {
        local_firms: 6.0,
        skilled_labor: 5.5,
        ppp_openness: 6.0,
        total: 5.8
      }
    }
  },
  {
    country: 'Egypt',
    scores: {
      infrastructure: {
        road_rail_index: 6.0,
        energy_reliability: 6.5,
        port_performance: 6.0,
        total: 6.2
      },
      regulatory: {
        doing_business_score: 5.5,
        import_export_procedures: 5.0,
        legal_predictability: 5.0,
        total: 5.2
      },
      market_demand: {
        manufacturing_gdp: 6.5,
        industrial_growth: 6.0,
        active_projects: 7.0,
        total: 6.5
      },
      stability: {
        inflation_volatility: 4.5,
        fdi_flows: 6.0,
        political_stability: 4.0,
        total: 4.8
      },
      partnership: {
        local_firms: 6.0,
        skilled_labor: 5.5,
        ppp_openness: 5.0,
        total: 5.5
      }
    }
  },
  {
    country: 'Morocco',
    scores: {
      infrastructure: {
        road_rail_index: 6.5,
        energy_reliability: 6.0,
        port_performance: 6.5,
        total: 6.3
      },
      regulatory: {
        doing_business_score: 6.5,
        import_export_procedures: 6.0,
        legal_predictability: 6.0,
        total: 6.2
      },
      market_demand: {
        manufacturing_gdp: 6.0,
        industrial_growth: 6.0,
        active_projects: 6.5,
        total: 6.2
      },
      stability: {
        inflation_volatility: 6.0,
        fdi_flows: 6.5,
        political_stability: 6.5,
        total: 6.3
      },
      partnership: {
        local_firms: 6.0,
        skilled_labor: 5.5,
        ppp_openness: 6.0,
        total: 5.8
      }
    }
  }
];

// Calculate total scores and add to data
initialData.forEach(data => {
  const weights = {
    infrastructure: 25,
    regulatory: 20,
    market_demand: 25,
    stability: 15,
    partnership: 15
  };

  data.total_score = (
    data.scores.infrastructure.total * weights.infrastructure +
    data.scores.regulatory.total * weights.regulatory +
    data.scores.market_demand.total * weights.market_demand +
    data.scores.stability.total * weights.stability +
    data.scores.partnership.total * weights.partnership
  ) / 100;
});

// Sort by total score and add ranks
initialData.sort((a, b) => b.total_score - a.total_score);
initialData.forEach((data, index) => {
  data.rank = index + 1;
});

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Score.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await Score.insertMany(initialData);
    console.log('Seeded initial data');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed(); 