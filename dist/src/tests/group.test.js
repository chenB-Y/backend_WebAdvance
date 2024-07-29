"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const App_1 = __importDefault(require("../App"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const group_model_1 = __importDefault(require("../models/group_model"));
const Product_model_1 = __importDefault(require("../models/Product_model"));
const user = {
    email: 'testGroup@test.com',
    password: '1234',
};
let app;
let userID;
let groupID;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    yield user_model_1.default.deleteMany({ email: user.email });
    yield user_model_1.default.deleteMany({ email: 'newUser@test.com' });
    yield group_model_1.default.deleteMany({ name: 'Test Group' });
    yield group_model_1.default.deleteMany({ name: 'Another Test Group7' });
    yield group_model_1.default.deleteMany({ name: 'Another Test Group3' });
    yield group_model_1.default.deleteMany({ name: 'Another Test Group' });
    yield group_model_1.default.deleteMany({ name: 'Test Group Update' });
    yield Product_model_1.default.deleteMany({ name: 'New Product' });
    // Register and login the test user
    const registerRes = yield (0, supertest_1.default)(app).post('/auth/register').send(user);
    expect(registerRes.statusCode).toEqual(200);
    const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);
    user.accessToken = loginRes.body.accessToken;
    userID = loginRes.body.userID; // Save userID for later use
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('Group Tests', () => {
    test('createNewGroup', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new group
        const res = yield (0, supertest_1.default)(app)
            .post('/group/createGroup')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ name: 'Test Group', participants: userID }); // Send group data
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name');
        // Save groupID for later use
        groupID = res.body._id;
    }));
    test('addProductToGroup', () => __awaiter(void 0, void 0, void 0, function* () {
        // Ensure the group exists
        const createGroupRes = yield (0, supertest_1.default)(app)
            .post('/group/createGroup')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ name: 'Another Test Group', participants: userID });
        expect(createGroupRes.statusCode).toEqual(201);
        const createdGroup = createGroupRes.body;
        groupID = createdGroup._id; // Save groupID
        // Add a product to the group
        const addProductRes = yield (0, supertest_1.default)(app)
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
    }));
    test('getProductFromGroup', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new group
        const createGroupRes = yield (0, supertest_1.default)(app)
            .post('/group/createGroup')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ name: 'Another Test Group7', participants: userID });
        expect(createGroupRes.statusCode).toEqual(201);
        const createdGroup = createGroupRes.body;
        groupID = createdGroup._id; // Save groupID
        // Fetch the group and its products
        const getGroupRes = yield (0, supertest_1.default)(app)
            .get(`/group/getGroup/${groupID}`) // Changed to GET request
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(getGroupRes.statusCode).toEqual(200);
        expect(getGroupRes.body).toHaveProperty('_id');
        expect(getGroupRes.body).toHaveProperty('name');
        expect(getGroupRes.body).toHaveProperty('products');
    }));
    test('updateGroup', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new group for update test
        const createGroupRes = yield (0, supertest_1.default)(app)
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
        const registerNewUserRes = yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send(newUser);
        expect(registerNewUserRes.statusCode).toEqual(200);
        const loginNewUserRes = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send(newUser);
        expect(loginNewUserRes.statusCode).toEqual(200);
        const newUserID = loginNewUserRes.body.userID;
        // Update the group by adding a new participant
        const updateGroupRes = yield (0, supertest_1.default)(app)
            .put(`/group/updateGroup/Test Group Update`)
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ userID: newUserID });
        expect(updateGroupRes.statusCode).toEqual(200);
        expect(updateGroupRes.body).toHaveProperty('_id');
        expect(updateGroupRes.body.participants).toContain(newUserID);
    }));
    test('deleteGroup', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new group
        const createGroupRes = yield (0, supertest_1.default)(app)
            .post('/group/createGroup')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ name: 'Another Test Group3', participants: userID });
        expect(createGroupRes.statusCode).toEqual(201);
        const createdGroup = createGroupRes.body;
        groupID = createdGroup._id; // Save groupID
        // Delete the group
        const deleteG = yield (0, supertest_1.default)(app)
            .delete(`/group/deleteGroup/${groupID}`)
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(deleteG.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=group.test.js.map