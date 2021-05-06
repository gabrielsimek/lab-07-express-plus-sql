/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Countries in South America');
});

// API routes,
app.get('/api/countries', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              president,
              language,
              capital,
              url,
              population,
              has_mcdonald as "hasMcdonald"
      FROM    countries;
    `);

    // send back the data
    res.json(data.rows); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/countries/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              president,
              language,
              capital,
              url,
              population,
              has_mcdonald as "hasMcdonald"
      FROM    countries
      WHERE   id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});
app.get('/api/countries/pop/:population', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              president,
              language,
              capital,
              url,
              population,
              has_mcdonald as "hasMcdonald"
      FROM    countries
      WHERE   population = $1;
     
    `, [req.params.population]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.post('/api/countries', async (req, res) => {
  // use SQL query to post data...
  
  try {
    const country = req.body;
    const data = await client.query(`
      INSERT INTO countries (name, language,  president, capital, url, population, has_mcdonald)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, language,  president, capital, url, population, has_mcdonald as "hasMcdonald"; 
    `, [country.name, country.language, country.president,  country.capital, country.url, country.population, country.hasMcdonald]);

    // send back the data (data will equal what we are returning after from the post)
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.put('/api/countries/:id', async (req, res) => {
  // use SQL query to post data...
  
  try {
    const country = req.body;
    const data = await client.query(`
      UPDATE  countries 
        SET name = $1, language = $2, president = $3, capital = $4, url = $5, population = $6, has_mcdonald = $7
      WHERE id = $8
      RETURNING id, name, language,  president, capital, url, population, has_mcdonald as "hasMcdonald"; 
    `, [country.name, country.language, country.president,  country.capital, country.url, country.population, country.hasMcdonald, req.params.id]);

    // send back the data (data will equal what we are returning after from the post)
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.delete('/api/countries/:id', async (req, res) => {
  // use SQL query to post data...
  
  try {
   
    const data = await client.query(`
      DELETE FROM countries
      WHERE id = $1
      RETURNING id, name, language,  president, capital, url, population, has_mcdonald as "hasMcdonald"; 
    `, [req.params.id]);

    // send back the data (data will equal what we are returning after from the post)
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

export default app;