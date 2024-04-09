import express, {Express} from 'express';
const app = express();
import env from 'dotenv';
env.config();
import bodyParser from 'body-parser';
import studentRoute from './routes/student_route';
import postRoute from './routes/post_route';
import mongoose from 'mongoose';

const init = () =>{
    const promise = new Promise<Express>((resolve) => {
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


export default init;

