const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/user');

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/users/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&redirect_uri=http:\/\/localhost:7890\/api\/v1\/users\/login\/callback&scope=user/i
    );
  });

  it('should login and redirect to home', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/users/login/callback?code=42')
      .redirects(1);
    
    expect(res.status).toEqual(200);
    // expect(req.body).toEqual({
    //   user_id: expect.any(String),
    //   github: 'ProsperieEli',
    //   avatar: expect.any(String),
    //   iat: expect.any(Number),
    //   exp: expect.any(Number),
    // });
  });
});
