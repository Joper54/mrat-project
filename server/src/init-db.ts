import { pool, initializeDatabase } from './db.js';
import { countries } from './data/countries.js';

async function initializeData() {
  try {
    // Initialize database structure
    await initializeDatabase();

    // Insert countries
    for (const country of countries) {
      await pool.query(
        'INSERT INTO countries (code, name) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
        [country.code, country.name]
      );
    }

    console.log('Database initialized with countries');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
}

initializeData(); 