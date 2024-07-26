import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import env from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import productRoute from './routes/product_route';
import postRoute from './routes/post_route';
import authRoute from './routes/auth_route';
import fileRoute from './routes/file_route';
import mongoose, { mongo } from 'mongoose';
import groupRoute from './routes/group_route';
import http from 'http'

env.config();

const app = express();
const PORT = 4000;
mongoose.connect(process.env.PROD_ENV = "production" ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL )
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Connection error to DB:', err);
  });

// CORS Configuration
app.use(cors({
  origin: 'https://10.10.248.174', // Allow requests from your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/post', postRoute);
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
  var server = https.createServer(options, app);
  server.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT:${process.env.PORT}`);
});
}
