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
const user = {
    email: 'test@test.com',
    password: '1234',
    username: 'ccccccc',
};
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log('before all');
    yield user_model_1.default.deleteMany({ email: user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('Register Tests', () => {
    test('Register', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/auth/register').send(user);
        expect(res.statusCode).toEqual(200);
        const res2 = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty('accessToken');
        expect(res2.body).toHaveProperty('refreshToken');
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
    }));
    test('Login', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
    }));
    test('Middleware', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/product').send();
        expect(res.statusCode).not.toEqual(200);
        const res2 = yield (0, supertest_1.default)(app)
            .get('/product')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send();
        expect(res2.statusCode).toEqual(200);
        yield (0, supertest_1.default)(app)
            .post('/post')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({
            title: 'test',
            message: 'test',
            owner: '12345',
        });
        expect(res2.statusCode).toEqual(200);
    }));
    jest.setTimeout(10000);
    test('Refresh Token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((r) => setTimeout(r, 6000));
        const res2 = yield (0, supertest_1.default)(app)
            .get('/product')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send();
        expect(res2.statusCode).toEqual(200);
        const res = yield (0, supertest_1.default)(app)
            .get('/auth/refresh')
            .set('refreshtoken', user.refreshToken)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
        const res3 = yield (0, supertest_1.default)(app)
            .get('/product')
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send();
        expect(res3.statusCode).toEqual(200);
    }));
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
    test('getUserData', () => __awaiter(void 0, void 0, void 0, function* () {
        // Increase the timeout for this specific test
        jest.setTimeout(20000); // Set timeout to 20 seconds (20000 ms)
        const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(loginRes.statusCode).toEqual(200);
        const accessToken = loginRes.body.accessToken; // Access token from login response
        const userId = loginRes.body.userID; // User ID from login response
        const getUserRes = yield (0, supertest_1.default)(app)
            .get(`/auth/getUser/${userId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send();
        expect(getUserRes.statusCode).toEqual(200);
    }));
    test('update-username', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(loginRes.statusCode).toEqual(200);
        const accessToken = loginRes.body.accessToken; // Access token from login response
        const userId = loginRes.body.userID; // User ID from login response
        const updateUsername = yield (0, supertest_1.default)(app)
            .put(`/auth/update-username`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ userID: userId, newUsername: 'yyyyyyy', url: '' });
        expect(updateUsername.statusCode).toEqual(200);
    }));
    test('Logout', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
        const res2 = yield (0, supertest_1.default)(app)
            .get('/auth/logout')
            .set('Authorization', 'Bearer ' + user.refreshToken)
            .send();
        expect(res2.statusCode).toEqual(200);
        const res3 = yield (0, supertest_1.default)(app)
            .get('/auth/refresh')
            .set('refreshtoken', user.refreshToken)
            .send();
        expect(res3.statusCode).not.toEqual(200);
    }));
});
//# sourceMappingURL=auth.test.js.map