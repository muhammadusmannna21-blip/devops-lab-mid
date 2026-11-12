const request = require('supertest');
const app = require('../server');

beforeEach(() => {
  app.resetSubmissions();
});

describe('Assignment Submission Portal Tests', () => {
  test('1. Complete details and valid submission URL saves and appears in list', async () => {
    const payload = {
      name: 'Ali Raza',
      regNo: 'FA22-BCS-045',
      title: 'DevOps Lab Mid',
      url: 'https://github.com/aliraza/devops-lab'
    };

    const postRes = await request(app).post('/api/submissions').send(payload);
    expect(postRes.statusCode).toBe(201);

    const getRes = await request(app).get('/api/submissions');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].regNo).toBe('FA22-BCS-045');
  });

  test('2. Missing registration number is rejected with validation message', async () => {
    const payload = {
      name: 'Ali Raza',
      regNo: '',
      title: 'DevOps Lab Mid',
      url: 'https://github.com/aliraza/devops-lab'
    };

    const res = await request(app).post('/api/submissions').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/registration number/i);
  });

  test('3. Invalid submission URL is rejected and not saved', async () => {
    const payload = {
      name: 'Ali Raza',
      regNo: 'FA22-BCS-045',
      title: 'DevOps Lab Mid',
      url: 'not-a-valid-url'
    };

    const res = await request(app).post('/api/submissions').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/valid.*url/i);

    const getRes = await request(app).get('/api/submissions');
    expect(getRes.body.length).toBe(0);
  });
});