import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mrat',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Initialize TimescaleDB tables
async function initializeDatabase() {
  try {
    // Create countries table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        code VARCHAR(3) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create metrics hypertable
    await pool.query(`
      CREATE TABLE IF NOT EXISTS country_metrics (
        time TIMESTAMPTZ NOT NULL,
        country_code VARCHAR(3) REFERENCES countries(code),
        metric_name VARCHAR(50) NOT NULL,
        value NUMERIC,
        PRIMARY KEY (time, country_code, metric_name)
      );
    `);

    // Convert to hypertable if not already
    await pool.query(`
      SELECT create_hypertable('country_metrics', 'time', if_not_exists => TRUE);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Function to store metrics
async function storeMetrics(countryCode: string, metrics: Record<string, number | null>, timestamp: Date = new Date()) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    for (const [metricName, value] of Object.entries(metrics)) {
      if (value !== null) {
        await client.query(
          'INSERT INTO country_metrics (time, country_code, metric_name, value) VALUES ($1, $2, $3, $4)',
          [timestamp, countryCode, metricName, value]
        );
      }
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Function to get metrics for visualization
async function getMetricsForVisualization(
  startTime: Date,
  endTime: Date,
  metricNames: string[],
  countryCodes?: string[]
) {
  const query = `
    SELECT 
      time_bucket('1 day', time) AS bucket,
      country_code,
      metric_name,
      AVG(value) as value
    FROM country_metrics
    WHERE 
      time >= $1 
      AND time <= $2
      AND metric_name = ANY($3)
      ${countryCodes ? 'AND country_code = ANY($4)' : ''}
    GROUP BY bucket, country_code, metric_name
    ORDER BY bucket, country_code, metric_name;
  `;

  const params = [startTime, endTime, metricNames, countryCodes].filter(Boolean);
  const result = await pool.query(query, params);
  return result.rows;
}

export { pool, initializeDatabase, storeMetrics, getMetricsForVisualization }; 