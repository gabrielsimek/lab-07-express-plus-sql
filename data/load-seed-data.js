/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import countries from './countries.js';
import users from './users.js';


run();

async function run() {

  try {

    const data = await Promise.all(
      users.map((user) => {
        return client.query(`
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [user.name, user.email, user.password]);
      })
    );

    const user = data[0].rows[0];
    console.log(user);

    await Promise.all(
      countries.map(country => {
        return client.query(`
          INSERT INTO countries (name, language, president, capital, url, population, has_beach, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
        [country.name, country.language, country.president,  country.capital, country.url, country.population, country.hasBeach, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}