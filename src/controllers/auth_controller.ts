import {Request, Response, NextFunction } from 'express'
import User from '../models/user_model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export type AuthRequest = Request & {user: {_id: string}};

const register = async (req: AuthRequest , res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email === undefined || password === undefined){
        return res.status(400).send('Email or password not provided');
    }
    try{
        const user = await User.findOne({email: email});
        if (user){
            return res.status(400).send('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({email:email, password:hashedPassword});
        res.send(newUser);
    }catch(err){
        return res.status(500).send(err.message);
    }
}  

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email === undefined || password === undefined){
        return res.status(400).send('Email or password not provided');
    }
    try{
        const user = await User.findOne({email: email});
        if (user == null){
            return res.status(400).send('User does not exists');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            res.status(400).send("Invalid Credentials");
        }
        const accessToken = jwt.sign({id_: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
        return res.status(200).send({token: accessToken});
    }catch(err){
        return res.status(500).send(err.message);
    }
}   

const logout = (req: Request, res: Response) => {
    res.send('logout');
}   

export const authMiddleware = (req: Request, res: Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        return res.status(401).send('No token provided');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data :jwt.JwtPayload) => { 
        if (err){
            return res.status(401).send('Token is not valid');
        }
        const id = data.id_;
        req.user = {_id: id};
        return next(); 
    });
}

export default {
    register,
    login,
    logout,
    authMiddleware
}