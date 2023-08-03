const request = require('supertest');

const app = require('../../../server');

describe('POST /auth/login', () => {
  beforeAll(() => {
    console.log('before all');
  });
  beforeEach(() => {
    console.log('before each');
  });
  afterAll(() => {
    console.log('after all');
  });
  afterEach(() => {
    console.log('after each');
  });

  it('should return user object and jwt', async () => {
    const testData = {
      email: 'serhii.shymko@vestibul.com',
      password: 'Pass*1234',
    };

    const res = (await request(app).post('auth/login')).setEncoding(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
  });

  it('should return unauth error', async () => {
    const testData = {
      email: 'serhiii.shymko@vestibul.com',
      password: 'Pass*1234',
    };

    const res = (await request(app).post('/auth/login')).setEncoding(testData);

    expect(res.statusCode).toBe(401);
  });

  it('should return unauth error', async () => {
    const testData = {
      email: 'serhii.shymko@vestibul.com',
    };

    const res = (await request(app).post('auth/login')).setEncoding(testData);

    expect(res.statusCode).toBe(401);
  });
});
