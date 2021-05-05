/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import countries from './countries.js';


run();

async function run() {

  try {

    await Promise.all(
      countries.map(country => {
        return client.query(`
          INSERT INTO countries (name, language, president, capital, url, population, has_mcdonald)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [country.name, country.language, country.president,  country.capital, country.url, country.population, country.hasMcdonald]);
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