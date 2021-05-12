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
      hasBeach: true
  
    },
    {
      id: expect.any(Number),
      name: 'Ecuador',
      president: 'Lenín Moreno',
      language: 'Spanish',
      capital: 'Quito',
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg',
      population: 50372424,
      hasBeach: true
  
    },
    {
      id: expect.any(Number),
      name: 'Peru',
      president: 'Lenín Moreno',
      language: 'Spanish',
      capital: 'lima',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg',
      population: 32824358,
      hasBeach: true
  
    },
    {
      id: expect.any(Number),
      name: 'Bolivia',
      president: 'Luis Arce',
      language: 'Spanish',
      capital: 'La Paz',
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Bandera_de_Bolivia_%28Estado%29.svg',
      population: 1142245,
      hasBeach: false
  
    },
    {
      id: expect.any(Number),
      name: 'Chile',
      president: 'Sebastián Piñera',
      language: 'Spanish',
      capital: 'Santiago',
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Chile.svg',
      population: 17574003,
      hasBeach: true
  
    },
    {
      id: expect.any(Number),
      name: 'Brasil',
      president: 'Jair Bolsonaro',
      language: 'Portuguese',
      capital: 'Brasilia',
      url: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg',
      population: 210147125,
      hasBeach: true
  
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
    let user;
    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;



    });

    let colombia = {
      id: expect.any(Number),
      name: 'Colombia',
      president: 'Iván Duque Márquez',
      language: 'Spanish',
      capital: 'Bogota',
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg',
      population: 17684536,
      hasBeach: true
  
    };

    let  brasil = {
      id: expect.any(Number),
      name: 'Brasil',
      president: 'Jair Bolsonaro',
      language: 'Portuguese',
      capital: 'Brasilia',
      url: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg',
      population: 210147125,
      hasBeach: true
  
    };
    
    let peru = {
      id: expect.any(Number),
      name: 'Peru',
      president: 'Lenín Moreno',
      language: 'Spanish',
      capital: 'lima',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg',
      population: 32824358,
      hasBeach: true
  
    };

    it('Post Colombia to /api/countries', async () => {
      colombia.userId = user.id;
      const response = await request
        .post('/api/countries')
        .send(colombia);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(colombia);

      colombia = response.body;
    });

    it('PUT updated colombia to /api/countries/:id', async () => {
      colombia.capital = 'medellin';
      colombia.hasBeach = false;
      
      const response = await request
        .put(`/api/countries/${colombia.id}`)
        .send(colombia);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(colombia);

        

    });
    
    it('Get list of countries from /api/countries/', async () => {
      brasil.userId = user.id; //user id from our user which we posted up initially. then post updated objects so that they get a definitive  id from db
      peru.userId = user.id;
      const response1 = await request
        .post('/api/countries')
        .send(brasil);
      const response2 = await request
        .post('/api/countries')
        .send(peru);

      brasil = response1.body;
      peru = response2.body;

      const response = await request
        .get('/api/countries');
     


      expect(response.status).toBe(200);
      const expected = [colombia, brasil, peru].map((country) => {
        return {
          userName: user.name,
          ...country
        };
      });
      
      expect(response.body).toEqual(expect.arrayContaining(expected));
      

    });


    it('GET /api/countries/:id colombia', async () => {
      const response = await request.get(`/api/countries/${colombia.id}`);


      expect(response.status).toBe(200);
      

      expect(response.body).toEqual({ 
        ...colombia, userName: user.name
      });
    });

    
    it('GET peru from /api/countries/:population ', async () => {
      const response = await request.get(`/api/countries/pop/${peru.population}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        ...peru, userName: user.name
      });
    });

    it('get list of countries from /api/users/:id/countries', async () => {

      const response = await request.get(`/api/users/${user.id}/countries`);
      expect(response.status).toBe(200);

      const expected = [colombia, brasil, peru].map((country) => {
        return {
          userName: user.name,
          userId: user.id,
          ...country
        };
      });
      
      expect(response.body).toEqual(expect.arrayContaining(expected));
      


    });

    it('Delete colombia from /api/countries/:id', async () => {
      const deleteResponse = await request
        .delete(`/api/countries/${colombia.id}`);
     
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual(colombia);



      const response = await request.get('/api/countries');
      expect(response.status).toBe(200);
      expect(response.body.find(country => country.id === colombia.id)).toBeUndefined();
    });

    
  
  });

  describe('seed data tests', () => {
    beforeAll(() => {
      execSync('npm run setup-db');
    });

    
    it('GET /api/countries', async () => {
      const response = await request.get('/api/countries');

      expect(response.status).toBe(200);

      expect(response.body.length).toBeGreaterThan(0);

      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        president: expect.any(String),
        language: expect.any(String),
        capital: expect.any(String),
        url: expect.any(String),
        population: expect.any(Number),
        hasBeach: expect.any(Boolean),
        userId: expect.any(Number),
        userName: expect.any(String)

      });


    });

  });
  describe('distinct lang test', () => {
    beforeAll(() => {
      execSync('npm run setup-db');
    });
    it('GET /api/countries/languages', async () => {
      let colombia = {
        id: expect.any(Number),
        name: 'Colombia',
        president: 'Iván Duque Márquez',
        language: 'Spanish',
        capital: 'Bogota',
        url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg',
        population: 17684536,
        hasBeach: true
    
      };
  
      let  brasil = {
        id: expect.any(Number),
        name: 'Brasil',
        president: 'Jair Bolsonaro',
        language: 'Portuguese',
        capital: 'Brasilia',
        url: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg',
        population: 210147125,
        hasBeach: true
    
      };
      
      let peru = {
        id: expect.any(Number),
        name: 'Peru',
        president: 'Lenín Moreno',
        language: 'Spanish',
        capital: 'lima',
        url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg',
        population: 32824358,
        hasBeach: true
    
      };
      // act - make the request
      const response = await request.get('/api/countries/languages');

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return the data we expected?
      const expected = [...new Set([colombia, brasil, peru].map((country) => {
        return country.language;

      }))].map((item) => {
        return { language: item };
      });
      
      expect(response.body).toEqual(expect.arrayContaining(expected));

    });
  });
  


});



