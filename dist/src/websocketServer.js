"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = broadcast;
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 4001 });
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
exports.default = wss;
//# sourceMappingURL=websocketServer.js.map