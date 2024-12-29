const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const populateCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name');
    const countries = response.data;

    for (const country of countries) {
      const countryName = country.name.common;

      await pool.query(
        'INSERT INTO countries (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [countryName]
      );
    }

    console.log('Countries have been successfully populated!');
  } catch (error) {
    console.error('Error populating countries:', error.message);
  } finally {
    pool.end();
  }
};

populateCountries();