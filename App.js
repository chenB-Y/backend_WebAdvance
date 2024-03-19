const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT;
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error to DB:'));
db.once('open', () => console.log('connected to DB'));

const studentRoute = require('./routes/student_route');
const postRoute = require('./routes/post_route');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/student', studentRoute);
app.use('/post', postRoute);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

