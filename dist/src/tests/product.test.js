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
const Product_model_1 = __importDefault(require("../models/Product_model"));
const comment_model_1 = __importDefault(require("../models/comment_model"));
const user = {
    email: 'testProduct@test.com',
    password: '1234',
};
let app;
let productId; // Variable to store the product ID
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    yield user_model_1.default.deleteMany({ email: user.email });
    yield Product_model_1.default.deleteMany({ name: 'Test Product' });
    yield comment_model_1.default.deleteMany({ text: 'Hello' });
    // Register a new user
    const registerRes = yield (0, supertest_1.default)(app).post('/auth/register').send(user);
    expect(registerRes.statusCode).toEqual(200);
    // Log in and get the access token
    const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
    expect(loginRes.statusCode).toEqual(200);
    const accessToken = loginRes.body.accessToken;
    // Create a new product
    const createProductRes = yield (0, supertest_1.default)(app)
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
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('Product Tests', () => {
    test('addCommentToProduct', () => __awaiter(void 0, void 0, void 0, function* () {
        // Log in and get the access token
        const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(loginRes.statusCode).toEqual(200);
        const accessToken = loginRes.body.accessToken;
        // Add a comment to the product
        const addCommentRes = yield (0, supertest_1.default)(app)
            .post(`/product/addComment/${productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ userID: loginRes.body.userID, username: 'chenh', text: 'Hello' });
        expect(addCommentRes.statusCode).toEqual(200);
        expect(addCommentRes.body).toHaveProperty('name');
    }));
    test('getCommentOfProduct', () => __awaiter(void 0, void 0, void 0, function* () {
        // Log in and get the access token
        const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(loginRes.statusCode).toEqual(200);
        const accessToken = loginRes.body.accessToken;
        // Get comments for the product
        const getCommentRes = yield (0, supertest_1.default)(app)
            .get(`/product/comments/${productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send();
        expect(getCommentRes.statusCode).toEqual(200);
    }));
    test('updateProduct', () => __awaiter(void 0, void 0, void 0, function* () {
        // Log in and get the access token
        const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(loginRes.statusCode).toEqual(200);
        const accessToken = loginRes.body.accessToken;
        // Update the product
        const updateProductRes = yield (0, supertest_1.default)(app)
            .put(`/product/update-product/${productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
            name: 'UpdatedProduct',
            amount: 15,
            imageUrl: 'http://localhost:3000/test-updated.png',
        });
        expect(updateProductRes.statusCode).toEqual(200);
        expect(updateProductRes.body.name).toBe('UpdatedProduct');
    }));
    test('deleteProduct', () => __awaiter(void 0, void 0, void 0, function* () {
        // Log in and get the access token
        const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(loginRes.statusCode).toEqual(200);
        const accessToken = loginRes.body.accessToken;
        // Delete the product
        const deleteProductRes = yield (0, supertest_1.default)(app)
            .delete(`/product/${productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send();
        expect(deleteProductRes.statusCode).toEqual(200);
        expect(deleteProductRes.body).toBe(`Product with id: ${productId} deleted along with its comments`);
    }));
});
//# sourceMappingURL=product.test.js.map