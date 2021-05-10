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




// users
app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email; 
    `, [user.name, user.email, user.password]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

app.get('/api/users/:id/countries', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
        SELECT  
              c.id, 
              c.name,
              president,
              language,
              capital,
              url,
              population,
              has_mcdonald as "hasMcdonald",
              c.user_id as "userId",
              u.name as "userName"

        FROM    countries c
        JOIN    users u
        ON      c.user_id = u.id
        WHERE   u.id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});


//api routes
app.get('/api/countries', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  c.id, 
              c.name,
              president,
              language,
              capital,
              url,
              population,
              has_mcdonald as "hasMcdonald",
              c.user_id as "userId",
              u.name as "userName"

      FROM    countries c
      JOIN    users u
      ON      c.user_id = u.id;
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
        SELECT  
              c.id, 
              c.name,
              president,
              language,
              capital,
              url,
              population,
              has_mcdonald as "hasMcdonald",
              c.user_id as "userId",
              u.name as "userName"

        FROM    countries c
        JOIN    users u
        ON      c.user_id = u.id
        WHERE   c.id = $1;
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
    SELECT  
    c.id, 
    c.name,
    president,
    language,
    capital,
    url,
    population,
    has_mcdonald as "hasMcdonald",
    c.user_id as "userId",
    u.name as "userName"

FROM    countries c
JOIN    users u
ON      c.user_id = u.id

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
      INSERT INTO countries (name, language,  president, capital, url, population, has_mcdonald, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, language,  president, capital, url, population, has_mcdonald as "hasMcdonald", user_id as "userId"; 
    `, [country.name, country.language, country.president,  country.capital, country.url, country.population, country.hasMcdonald, country.userId]);

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
      RETURNING id, name, language,  president, capital, url, population, has_mcdonald as "hasMcdonald", user_id as "userId"; 
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
      RETURNING id, name, language,  president, capital, url, population, has_mcdonald as "hasMcdonald", user_id as "userId"
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