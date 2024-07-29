import request from 'supertest';
import init from '../App';
import mongoose from 'mongoose';
import User from '../models/user_model';

type TestUser = {
  email: string;
  password: string;
  username: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
};
const user: TestUser = {
  email: 'test@test.com',
  password: '1234',
  username: 'ccccccc',
};

let app;
beforeAll(async () => {
  app = await init();
  console.log('before all');
  await User.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Register Tests', () => {
  test('Register', async () => {
    const res = await request(app).post('/auth/register').send(user);
    expect(res.statusCode).toEqual(200);
    const res2 = await request(app).post('/auth/login').send(user);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toHaveProperty('accessToken');
    expect(res2.body).toHaveProperty('refreshToken');
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
  });
  test('Login', async () => {
    const res = await request(app).post('/auth/login').send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
  });
  test('Middleware', async () => {
    const res = await request(app).get('/product').send();
    expect(res.statusCode).not.toEqual(200);

    const res2 = await request(app)
      .get('/product')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send();
    expect(res2.statusCode).toEqual(200);

    await request(app)
      .post('/post')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({
        title: 'test',
        message: 'test',
        owner: '12345',
      });
    expect(res2.statusCode).toEqual(200);
  });

  jest.setTimeout(10000);

  test('Refresh Token', async () => {
    await new Promise((r) => setTimeout(r, 6000));
    const res2 = await request(app)
      .get('/product')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send();
    expect(res2.statusCode).toEqual(200);

    const res = await request(app)
      .get('/auth/refresh')
      .set('refreshtoken', user.refreshToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;

    const res3 = await request(app)
      .get('/product')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send();
    expect(res3.statusCode).toEqual(200);
  });

  // test('Refresh Token hacked', async () => {
  //   const res = await request(app)
  //     .get('/auth/refresh')
  //     .set('refreshtoken', user.refreshToken)
  //     .send();
  //   expect(res.statusCode).toEqual(200);
  //   const newRefreshToken = res.body.refreshToken;
  //   const res2 = await request(app)
  //     .get('/auth/refresh')
  //     .set('refreshtoken', user.refreshToken)
  //     .send();
  //   expect(res2.statusCode).toEqual(200);
  //   const res3 = await request(app)
  //     .get('/auth/refresh')
  //     .set('refreshtoken', newRefreshToken)
  //     .send();
  //   expect(res3.statusCode).not.toEqual(200);
  // });

  test('getUserData', async () => {
    // Increase the timeout for this specific test
    jest.setTimeout(20000); // Set timeout to 20 seconds (20000 ms)

    const loginRes = await request(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);

    const accessToken = loginRes.body.accessToken; // Access token from login response
    const userId = loginRes.body.userID; // User ID from login response

    const getUserRes = await request(app)
      .get(`/auth/getUser/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(getUserRes.statusCode).toEqual(200);
  });

  test('update-username', async () => {
    const loginRes = await request(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);

    const accessToken = loginRes.body.accessToken; // Access token from login response
    const userId = loginRes.body.userID; // User ID from login response

    const updateUsername = await request(app)
      .put(`/auth/update-username`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ userID: userId, newUsername: 'yyyyyyy', url: '' });

    expect(updateUsername.statusCode).toEqual(200);
  });

  test('Logout', async () => {
    const res = await request(app).post('/auth/login').send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;

    const res2 = await request(app)
      .get('/auth/logout')
      .set('Authorization', 'Bearer ' + user.refreshToken)
      .send();
    expect(res2.statusCode).toEqual(200);

    const res3 = await request(app)
      .get('/auth/refresh')
      .set('refreshtoken', user.refreshToken)
      .send();
    expect(res3.statusCode).not.toEqual(200);
  });
});
