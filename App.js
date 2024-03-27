const express = require('express');
const app = express();
const env = require('dotenv').config();
const bodyParser = require('body-parser');

const studentRoute = require('./routes/student_route');
const postRoute = require('./routes/post_route');

const init = () =>{
    const promise = new Promise((resolve, reject) => {
        const mongoose = require('mongoose');
        const db = mongoose.connection; 
        db.on('error', console.error.bind(console, 'connection error to DB:'));
        db.once('open', () => console.log('connected to DB'));
        mongoose.connect(process.env.DATABASE_URL).then(() => {
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
    
            app.use('/student', studentRoute);
            app.use('/post', postRoute);
            resolve(app);
        });
    });

    return promise;
};


module.exports = init;

