const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://joelsaarelainen:cbHEnuaylnWoHmJQ@cluster0.tcglbjj.mongodb.net/mrat?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

const countries = [
  { name: "Nigeria", code: "NGA", gdp: 448120000000, population: 206139589 },
  { name: "Ghana", code: "GHA", gdp: 72182000000, population: 31072940 },
  { name: "South Africa", code: "ZAF", gdp: 419020000000, population: 59308690 },
  { name: "Kenya", code: "KEN", gdp: 110347000000, population: 53771300 },
  { name: "Egypt", code: "EGY", gdp: 404140000000, population: 104124440 },
  { name: "Morocco", code: "MAR", gdp: 124114000000, population: 36910560 }
];

async function updateCountries() {
  try {
    await client.connect();
    const db = client.db('mrat');
    const col = db.collection('countries');
    for (const country of countries) {
      await col.updateOne(
        { code: country.code },
        { $set: { gdp: country.gdp, population: country.population } }
      );
    }
    console.log('Countries updated!');
  } finally {
    await client.close();
  }
}

updateCountries(); 