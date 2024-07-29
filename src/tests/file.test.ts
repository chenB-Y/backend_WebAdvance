import init from '../App';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';

type TestUser = {
  email: string;
  password: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
};

const user: TestUser = {
  email: 'testProduct@test.com',
  password: '1234',
};

let app: Express;

beforeAll(async () => {
  app = await init();
  console.log('beforeAll');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('File Tests', () => {
  test('upload Product file', async () => {
    const filePath = `${__dirname}/linkedIn.png`;
    console.log(filePath);

    try {
      const loginRes = await request(app).post('/auth/login').send(user);
      expect(loginRes.statusCode).toEqual(200);
      const accessToken = loginRes.body.accessToken;
      const response = await request(app)
        .post('/file/uploadProduct')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', filePath);
      expect(response.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });
  test('upload User file', async () => {
    const filePath = `${__dirname}/linkedIn.png`;
    console.log(filePath);

    try {
      const loginRes = await request(app).post('/auth/login').send(user);
      expect(loginRes.statusCode).toEqual(200);
      const accessToken = loginRes.body.accessToken;
      const response = await request(app)
        .post('/file/uploadUser')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', filePath);
      expect(response.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });
});
