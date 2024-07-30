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
const post_route_1 = __importDefault(require("./routes/post_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const file_route_1 = __importDefault(require("./routes/file_route"));
const mongoose_1 = __importDefault(require("mongoose"));
const group_route_1 = __importDefault(require("./routes/group_route"));
const http_1 = __importDefault(require("http"));
const events_1 = require("events");
dotenv_1.default.config();
const sseEmitter = new events_1.EventEmitter();
sseEmitter.setMaxListeners(100);
const app = (0, express_1.default)();
const PORT = 4000;
mongoose_1.default.connect(process.env.PROD_ENV = "production" ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL)
    .then(() => {
    console.log('Connected to DB');
})
    .catch((err) => {
    console.error('Connection error to DB:', err);
});
const allowedOrigins = ['https://10.10.248.174', 'https://node14.cs.colman.ac.il'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parser middleware
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Routes
app.use('/auth', auth_route_1.default);
app.use('/product', product_route_1.default);
app.use('/post', post_route_1.default);
app.use('/file', file_route_1.default);
app.use('/group', group_route_1.default);
app.use(express_1.default.static('/home/st111/projectCode/backend_WebAdvance/public/products'));
app.use(express_1.default.static('/home/st111/projectCode/backend_WebAdvance/public/users'));
if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http_1.default.createServer(app).listen(process.env.PORT);
    console.log(`Server is running on PORT:${process.env.PORT}`);
}
else {
    console.log('production!');
    // Load SSL certificates
    const keyPath = path_1.default.resolve(__dirname, '../../../../client-key.pem');
    const certPath = path_1.default.resolve(__dirname, '../../../../client-cert.pem');
    const options = {
        key: fs_1.default.readFileSync(keyPath),
        cert: fs_1.default.readFileSync(certPath),
    };
    var hostname = "0.0.0.0";
    var server = https_1.default.createServer(options, app);
    server.listen(4000, hostname);
    //  server.listen(4000,hostname, () => {
    //  console.log(`Server is running on PORT:${process.env.PORT}`);
    // });
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
}
function broadcast(data) {
    sseEmitter.emit('event', data);
}
//# sourceMappingURL=Server.js.map