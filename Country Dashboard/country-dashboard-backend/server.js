const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});

app.use(cors());
app.use(express.json());

// Register User
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Login User
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Favorite Country
app.post('/favorites', async (req, res) => {
  const { username, country } = req.body;
  console.log(username, country)
  try {

    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    const userId = userResult.rows[0]?.id;

    const countryResult = await pool.query(
      'SELECT id FROM countries WHERE name = $1',
      [country]
    );
    const countryId = countryResult.rows[0]?.id;
    
    console.log(countryId, userId)

    const result = await pool.query(
      `INSERT INTO Favorites (user_id, country_id) 
       VALUES ($1, $2)
       ON CONFLICT (user_id, country_id) 
       DO NOTHING`,
      [userId, countryId]
    );

    if (result.rowCount === 0) {
      res.status(400).json({ error: 'Country is already in your favorites' });
    } else {
      res.status(201).json({ message: 'Country added to favorites' });
    }

  } catch (err) {
    res.status(500).json({ error: 'Error adding country to favorites' });
    console.error(err);
  }
});

// Fetch Favorite Countries
app.get('/favorites', async (req, res) => {
  const { username } = req.query;

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favoriteResult = await pool.query(
      `SELECT countries.name 
       FROM favorites 
       JOIN countries ON favorites.country_id = countries.id 
       WHERE favorites.user_id = $1`,
      [userId]
    );

    const favorites = favoriteResult.rows.map(row => row.name);
    res.status(200).json({ favorites });

  } catch (err) {
    res.status(500).json({ error: 'Error fetching favorites' });
    console.error(err);
  }
});


// Remove Favorite Country
app.post('/unfavorite', async (req, res) => {
  const { username, country } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    const userId = userResult.rows[0]?.id;

    const countryResult = await pool.query(
      'SELECT id FROM countries WHERE name = $1',
      [country]
    );
    const countryId = countryResult.rows[0]?.id;

    if (!userId || !countryId) {
      return res
        .status(404)
        .json({ error: 'Invalid user or country. Record not found.' });
    }

    const checkFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND country_id = $2',
      [userId, countryId]
    );

    if (checkFavorite.rowCount === 0) {
      console.log('No matching record found to delete.');
      return res.status(404).json({ error: 'Favorite not found.' });
    }

    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND country_id = $2',
      [userId, countryId]
    );

    if (result.rowCount > 0) {
      console.log(`Successfully deleted favorite: ${username}, ${country}`);
      res.status(200).json({ message: 'Unfavorited successfully' });
    } else {
      res.status(404).json({ error: 'No matching record found to delete.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));