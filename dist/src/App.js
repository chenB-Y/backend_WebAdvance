"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const student_route_1 = __importDefault(require("./routes/student_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const mongoose_1 = __importDefault(require("mongoose"));
const init = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on('error', console.error.bind(console, 'connection error to DB:'));
        db.once('open', () => console.log('connected to DB'));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use(body_parser_1.default.json());
            app.use((0, cors_1.default)());
            app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', '*');
                res.header('Access-Control-Allow-Headers', '*');
                next();
            });
            app.use('/auth', auth_route_1.default);
            app.use('/student', student_route_1.default);
            app.use('/post', post_route_1.default);
            resolve(app);
        });
    });
    return promise;
};
exports.default = init;
//# sourceMappingURL=App.js.map