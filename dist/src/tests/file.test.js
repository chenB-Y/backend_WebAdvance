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
const App_1 = __importDefault(require("../App"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const user = {
    email: 'testProduct@test.com',
    password: '1234',
};
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log('beforeAll');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('File Tests', () => {
    test('upload Product file', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/linkedIn.png`;
        console.log(filePath);
        try {
            const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
            expect(loginRes.statusCode).toEqual(200);
            const accessToken = loginRes.body.accessToken;
            const response = yield (0, supertest_1.default)(app)
                .post('/file/uploadProduct')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('file', filePath);
            expect(response.statusCode).toEqual(200);
        }
        catch (err) {
            console.log(err);
        }
    }));
    test('upload User file', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/linkedIn.png`;
        console.log(filePath);
        try {
            const loginRes = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
            expect(loginRes.statusCode).toEqual(200);
            const accessToken = loginRes.body.accessToken;
            const response = yield (0, supertest_1.default)(app)
                .post('/file/uploadUser')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('file', filePath);
            expect(response.statusCode).toEqual(200);
        }
        catch (err) {
            console.log(err);
        }
    }));
});
//# sourceMappingURL=file.test.js.map