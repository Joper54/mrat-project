import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://joelsaarelainen:cbHEnuaylnWoHmJQ@cluster0.tcglbjj.mongodb.net/mrat?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

const countries = [
  { code: 'NGA', country: 'Nigeria' },
  { code: 'GHA', country: 'Ghana' },
  { code: 'ZAF', country: 'South Africa' },
  { code: 'KEN', country: 'Kenya' },
  { code: 'EGY', country: 'Egypt' },
  { code: 'MAR', country: 'Morocco' }
];

// Assessment factors mapped to World Bank indicators
const indicators = {
  gdp: { code: 'NY.GDP.MKTP.CD', factor: 'market' },
  population: { code: 'SP.POP.TOTL', factor: 'market' },
  unemployment: { code: 'SL.UEM.TOTL.ZS', factor: 'workforce' },
  school_enrollment: { code: 'SE.SEC.ENRR', factor: 'education' },
  life_expectancy: { code: 'SP.DYN.LE00.IN', factor: 'health' },
  electricity_access: { code: 'EG.ELC.ACCS.ZS', factor: 'infrastructure' },
  co2_emissions: { code: 'EN.ATM.CO2E.PC', factor: 'sustainability' }
};

async function fetchWorldBankData(countryCode, indicatorCode) {
  const url = `http://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=100`;
  const res = await fetch(url);
  const data = await res.json();
  if (data[1]) {
    for (const entry of data[1]) {
      if (entry.value !== null) {
        return entry.value;
      }
    }
  }
  return null;
}

(async () => {
  await client.connect();
  const db = client.db('mrat');
  const col = db.collection('countries');
  for (const c of countries) {
    const update = {};
    for (const [key, { code, factor }] of Object.entries(indicators)) {
      const value = await fetchWorldBankData(c.code, code);
      update[key] = value;
      // Optionally, you can also group by factor if you want
      if (!update[factor]) update[factor] = {};
      update[factor][key] = value;
    }
    console.log(`${c.country}:`, update);
    await col.updateOne(
      { country: c.country },
      { $set: update }
    );
  }
  await client.close();
  console.log('World Bank data updated with assessment factors!');
})(); 