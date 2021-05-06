import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  // beforeAll(() => {
  //   execSync('npm run setup-db');
  // });

  afterAll(async () => {
    return client.end();
  });



  const expectedCountries = [
    {
      id: expect.any(Number),
      name: 'Colombia',
      president: 'Iván Duque Márquez',
      language: 'Spanish',
      capital: 'Bogota',
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg',
      population: 17684536,
      hasMcdonald: true
  
    },
    {
      id: expect.any(Number),
      name: 'Ecuador',
      president: 'Lenín Moreno',
      language: 'Spanish',
      capital: 'Quito',
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg',
      population: 50372424,
      hasMcdonald: true
  
    },
    {
      id: expect.any(Number),
      name: 'Peru',
      president: 'Lenín Moreno',
      language: 'Spanish',
      capital: 'lima',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg',
      population: 32824358,
      hasMcdonald: true
  
    },
    {
      id: expect.any(Number),
      name: 'Bolivia',
      president: 'Luis Arce',
      language: 'Spanish',
      capital: 'La Paz',
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Bandera_de_Bolivia_%28Estado%29.svg',
      population: 1142245,
      hasMcdonald: false
  
    },
    {
      id: expect.any(Number),
      name: 'Chile',
      president: 'Sebastián Piñera',
      language: 'Spanish',
      capital: 'Santiago',
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Chile.svg',
      population: 17574003,
      hasMcdonald: true
  
    },
    {
      id: expect.any(Number),
      name: 'Brasil',
      president: 'Jair Bolsonaro',
      language: 'Portuguese',
      capital: 'Brasilia',
      url: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg',
      population: 210147125,
      hasMcdonald: true
  
    }
  
  ];
  
  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it.skip('GET /api/countries', async () => {
    // act - make the request
    const response = await request.get('/api/countries');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedCountries);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test.skip('GET /api/countries/:id', async () => {
    const response = await request.get('/api/countries/4');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedCountries[3]);
  });


  describe('/api/countries', () => {

    beforeAll(() => {
      execSync('npm run recreate-tables');
    });

    let colombia = {
      id: expect.any(Number),
      name: 'Colombia',
      president: 'Iván Duque Márquez',
      language: 'Spanish',
      capital: 'Bogota',
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg',
      population: 17684536,
      hasMcdonald: true
  
    };

    let ecaudor = {
      id: expect.any(Number),
      name: 'Ecuador',
      president: 'Lenín Moreno',
      language: 'Spanish',
      capital: 'Quito',
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg',
      population: 50372424,
      hasMcdonald: true
  
    };
    
    let peru = {
      id: expect.any(Number),
      name: 'Peru',
      president: 'Lenín Moreno',
      language: 'Spanish',
      capital: 'lima',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg',
      population: 32824358,
      hasMcdonald: true
  
    };

    it('Post Colombia to /api/countries', async () => {
      const response = await request
        .post('/api/countries')
        .send(colombia);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(colombia);

      colombia = response.body;
    });

    it('PUT updated colombia to /api/countries/:id', async () => {
      colombia.capital = 'medellin';
      colombia.hasMcdonald = false;
      
      const response = await request
        .put(`/api/countries/${colombia.id}`)
        .send(colombia);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(colombia);

        

    });

    it('Get list of countries from /api/countries/', async () => {
      const response1 = await request
        .post('/api/countries')
        .send(ecaudor);
      const response2 = await request
        .post('/api/countries')
        .send(peru);

      ecaudor = response1.body;
      peru = response2.body;

      const response = await request
        .get('/api/countries');


      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([colombia, ecaudor, peru]));

      

    });


    it('GET /api/countries/:id colombia', async () => {
      const response = await request.get(`/api/countries/${colombia.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(colombia);
    });

    
    it('GET peru from /api/countries/:population ', async () => {
      console.log(peru.population);
      const response = await request.get(`/api/countries/pop/${peru.population}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(peru);
    });
    

    it('Delete colombia from /api/countries/:id', async () => {
      const deleteResponse = await request
        .delete(`/api/countries/${colombia.id}`);
     
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual(colombia);



      const response = await request.get('/api/countries');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([ecaudor, peru]));
    });
  
  });


});



