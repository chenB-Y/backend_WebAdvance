"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = broadcast;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const product_route_1 = __importDefault(require("./routes/product_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const file_route_1 = __importDefault(require("./routes/file_route"));
const group_route_1 = __importDefault(require("./routes/group_route"));
const mongoose_1 = __importDefault(require("mongoose"));
const events_1 = require("events");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
dotenv_1.default.config();
const sseEmitter = new events_1.EventEmitter();
sseEmitter.setMaxListeners(100);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Web Dev 2024 REST API',
            version: '1.0.0',
            description: 'REST server including authentication using JWT',
        },
        servers: [{ url: 'https://node14.cs.colman.ac.il/' }],
    },
    apis: ['./src/routes/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
mongoose_1.default.connect(process.env.PROD_ENV === 'production' ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL)
    .then(() => {
    console.log('Connected to DB');
})
    .catch((err) => {
    console.error('Connection error to DB:', err);
});
const allowedOrigins = ['https://10.10.248.174', 'https://node14.cs.colman.ac.il'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'refreshtoken'],
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/auth', auth_route_1.default);
app.use('/product', product_route_1.default);
app.use('/file', file_route_1.default);
app.use('/group', group_route_1.default);
app.use(express_1.default.static('/home/st111/projectCode/backend_WebAdvance/public/products'));
app.use(express_1.default.static('/home/st111/projectCode/backend_WebAdvance/public/users'));
if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
}
else {
    console.log('production!');
    const keyPath = path_1.default.resolve(__dirname, '../../../../client-key.pem');
    const certPath = path_1.default.resolve(__dirname, '../../../../client-cert.pem');
    const options = {
        key: fs_1.default.readFileSync(keyPath),
        cert: fs_1.default.readFileSync(certPath),
    };
    const server = https_1.default.createServer(options, app);
    const hostname = '0.0.0.0';
    server.listen(4000, hostname, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
}
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const onData = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    sseEmitter.on('event', onData);
    req.on('close', () => {
        sseEmitter.removeListener('event', onData);
    });
});
function broadcast(data) {
    sseEmitter.emit('event', data);
}
//# sourceMappingURL=Server.js.map