import request from 'supertest';
import init from '../App';
import mongoose from 'mongoose';
import User from '../models/user_model';
import Product from '../models/Product_model';
import Comment from '../models/comment_model';

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

let app;
let productId: string; // Variable to store the product ID

beforeAll(async () => {
  app = await init();
  await User.deleteMany({ email: user.email });
  await Product.deleteMany({ name: 'Test Product' });
  await Comment.deleteMany({ text: 'Hello' });

  // Register a new user
  const registerRes = await request(app).post('/auth/register').send(user);
  expect(registerRes.statusCode).toEqual(200);

  // Log in and get the access token
  const loginRes = await request(app).post('/auth/login').send(user);
  expect(loginRes.statusCode).toEqual(200);
  const accessToken = loginRes.body.accessToken;

  // Create a new product
  const createProductRes = await request(app)
    .post('/product/')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: 'Test Product',
      amount: 10,
      imageUrl: 'http://localhost:3000/test.png',
      ownerId: loginRes.body.userID,
    });

  expect(createProductRes.statusCode).toEqual(201);
  productId = createProductRes.body._id; // Save the product ID
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product Tests', () => {
  test('addCommentToProduct', async () => {
    // Log in and get the access token
    const loginRes = await request(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);
    const accessToken = loginRes.body.accessToken;

    // Add a comment to the product
    const addCommentRes = await request(app)
      .post(`/product/addComment/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ userID: loginRes.body.userID, username: 'chenh', text: 'Hello' });

    expect(addCommentRes.statusCode).toEqual(200);
    expect(addCommentRes.body).toHaveProperty('name');
  });

  test('getCommentOfProduct', async () => {
    // Log in and get the access token
    const loginRes = await request(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);
    const accessToken = loginRes.body.accessToken;

    // Get comments for the product
    const getCommentRes = await request(app)
      .get(`/product/comments/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(getCommentRes.statusCode).toEqual(200);
  });

  test('updateProduct', async () => {
    // Log in and get the access token
    const loginRes = await request(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);
    const accessToken = loginRes.body.accessToken;

    // Update the product
    const updateProductRes = await request(app)
      .put(`/product/update-product/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'UpdatedProduct',
        amount: 15,
        imageUrl: 'http://localhost:3000/test-updated.png',
      });

    expect(updateProductRes.statusCode).toEqual(200);
    expect(updateProductRes.body.name).toBe('UpdatedProduct');
  });

  test('deleteProduct', async () => {
    // Log in and get the access token
    const loginRes = await request(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);
    const accessToken = loginRes.body.accessToken;

    // Delete the product
    const deleteProductRes = await request(app)
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(deleteProductRes.statusCode).toEqual(200);
    expect(deleteProductRes.body).toBe(
      `Product with id: ${productId} deleted along with its comments`
    );
  });
});
