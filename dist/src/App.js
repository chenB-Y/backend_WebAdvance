"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const product_route_1 = __importDefault(require("./routes/product_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const file_route_1 = __importDefault(require("./routes/file_route"));
const mongoose_1 = __importDefault(require("mongoose"));
const group_route_1 = __importDefault(require("./routes/group_route"));
const init = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on('error', console.error.bind(console, 'connection error to DB:'));
        db.once('open', () => console.log('connected to DB'));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use(body_parser_1.default.json());
            // Serve static files
            const frontendPath = path_1.default.join(__dirname, '../../../frontend_WebAdvance/build');
            app.use(express_1.default.static(frontendPath));
            app.use((0, cors_1.default)());
            app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', '*');
                res.header('Access-Control-Allow-Headers', '*');
                next();
            });
            app.use('/auth', auth_route_1.default);
            app.use('/product', product_route_1.default);
            app.use('/file', file_route_1.default);
            app.use('/group', group_route_1.default);
            // Serve the frontend for any other route
            app.get('*', (req, res) => {
                res.sendFile(path_1.default.join(frontendPath, 'index.html'));
            });
            resolve(app);
        });
    });
    return promise;
};
exports.default = init;
//# sourceMappingURL=App.js.map