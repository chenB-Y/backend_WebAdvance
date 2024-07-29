import request from 'supertest';
import init from '../App';
import mongoose from 'mongoose';
import User from '../models/user_model';
import Group from '../models/group_model';
import Product from '../models/Product_model';

type TestUser = {
  email: string;
  password: string;
  accessToken?: string;
};

const user: TestUser = {
  email: 'testGroup@test.com',
  password: '1234',
};

let app;
let userID: string;
let groupID: string;

beforeAll(async () => {
  app = await init();
  await User.deleteMany({ email: user.email });
  await User.deleteMany({ email: 'newUser@test.com' });
  await Group.deleteMany({ name: 'Test Group' });
  await Group.deleteMany({ name: 'Another Test Group7' });
  await Group.deleteMany({ name: 'Another Test Group3' });
  await Group.deleteMany({ name: 'Another Test Group' });
  await Group.deleteMany({ name: 'Test Group Update' });
  await Product.deleteMany({ name: 'New Product' });

  // Register and login the test user
  const registerRes = await request(app).post('/auth/register').send(user);
  expect(registerRes.statusCode).toEqual(200);

  const loginRes = await request(app).post('/auth/login').send(user);
  expect(loginRes.statusCode).toEqual(200);
  user.accessToken = loginRes.body.accessToken;
  userID = loginRes.body.userID; // Save userID for later use
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Group Tests', () => {
  test('createNewGroup', async () => {
    // Create a new group
    const res = await request(app)
      .post('/group/createGroup')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({ name: 'Test Group', participants: userID }); // Send group data

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name');

    // Save groupID for later use
    groupID = res.body._id;
  });

  test('addProductToGroup', async () => {
    // Ensure the group exists
    const createGroupRes = await request(app)
      .post('/group/createGroup')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({ name: 'Another Test Group', participants: userID });

    expect(createGroupRes.statusCode).toEqual(201);
    const createdGroup = createGroupRes.body;
    groupID = createdGroup._id; // Save groupID

    // Add a product to the group
    const addProductRes = await request(app)
      .post(`/group/addProduct/${groupID}`)
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({
        name: 'New Product',
        amount: 15,
        imageUrl: 'http://localhost/test.png',
        ownerId: userID,
      });

    expect(addProductRes.statusCode).toEqual(200);
    expect(addProductRes.body).toHaveProperty('_id');
    expect(addProductRes.body).toHaveProperty('name');
  });

  test('getProductFromGroup', async () => {
    // Create a new group
    const createGroupRes = await request(app)
      .post('/group/createGroup')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({ name: 'Another Test Group7', participants: userID });
    expect(createGroupRes.statusCode).toEqual(201);
    const createdGroup = createGroupRes.body;
    groupID = createdGroup._id; // Save groupID

    // Fetch the group and its products
    const getGroupRes = await request(app)
      .get(`/group/getGroup/${groupID}`) // Changed to GET request
      .set('Authorization', 'Bearer ' + user.accessToken);
    expect(getGroupRes.statusCode).toEqual(200);
    expect(getGroupRes.body).toHaveProperty('_id');
    expect(getGroupRes.body).toHaveProperty('name');
    expect(getGroupRes.body).toHaveProperty('products');
  });

  test('updateGroup', async () => {
    // Create a new group for update test
    const createGroupRes = await request(app)
      .post('/group/createGroup')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({ name: 'Test Group Update', participants: userID });
    expect(createGroupRes.statusCode).toEqual(201);
    const createdGroup = createGroupRes.body;
    groupID = createdGroup._id; // Save groupID

    // Register and login a new user to add as a participant
    const newUser = {
      email: 'newUser@test.com',
      password: '1234',
    };

    const registerNewUserRes = await request(app)
      .post('/auth/register')
      .send(newUser);
    expect(registerNewUserRes.statusCode).toEqual(200);

    const loginNewUserRes = await request(app)
      .post('/auth/login')
      .send(newUser);
    expect(loginNewUserRes.statusCode).toEqual(200);
    const newUserID = loginNewUserRes.body.userID;

    // Update the group by adding a new participant
    const updateGroupRes = await request(app)
      .put(`/group/updateGroup/Test Group Update`)
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({ userID: newUserID });

    expect(updateGroupRes.statusCode).toEqual(200);
    expect(updateGroupRes.body).toHaveProperty('_id');
    expect(updateGroupRes.body.participants).toContain(newUserID);
  });

  test('deleteGroup', async () => {
    // Create a new group
    const createGroupRes = await request(app)
      .post('/group/createGroup')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .send({ name: 'Another Test Group3', participants: userID });
    expect(createGroupRes.statusCode).toEqual(201);
    const createdGroup = createGroupRes.body;
    groupID = createdGroup._id; // Save groupID

    // Delete the group
    const deleteG = await request(app)
      .delete(`/group/deleteGroup/${groupID}`)
      .set('Authorization', 'Bearer ' + user.accessToken);
    expect(deleteG.statusCode).toEqual(200);
  });
});
