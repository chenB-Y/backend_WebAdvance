import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import env from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import productRoute from './routes/product_route';
import authRoute from './routes/auth_route';
import fileRoute from './routes/file_route';
import mongoose, { mongo } from 'mongoose';
import groupRoute from './routes/group_route';
import http from 'http'
import { EventEmitter } from 'events';

env.config();

const sseEmitter = new EventEmitter();
sseEmitter.setMaxListeners(100);

const app = express();
const PORT = 4000;
mongoose.connect(process.env.PROD_ENV = "production" ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL )
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Connection error to DB:', err);
  });

const allowedOrigins = ['https://10.10.248.174', 'https://node14.cs.colman.ac.il'];

app.use(cors({
  origin: (origin, callback) => {
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'refreshtoken'],
}));



// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/file', fileRoute);
app.use('/group', groupRoute);

app.use(express.static('/home/st111/projectCode/backend_WebAdvance/public/products'));
app.use(express.static('/home/st111/projectCode/backend_WebAdvance/public/users'));

if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(process.env.PORT);
    console.log(`Server is running on PORT:${process.env.PORT}`);
}
else{
  console.log('production!')
  // Load SSL certificates
  const keyPath = path.resolve(__dirname, '../../../../client-key.pem');
  const certPath = path.resolve(__dirname, '../../../../client-cert.pem');
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  var hostname = "0.0.0.0"
  var server = https.createServer(options, app);
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

export function broadcast(data) {
  sseEmitter.emit('event', data);
}
