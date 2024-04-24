import {Request, Response, NextFunction } from 'express'
import User, { IUser } from '../models/user_model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose'
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
        // add login logic here
        const tokens = await generateTokens(newUser);
        if (tokens == null){
            return res.status(400).send('Error generating tokens');
        }
        return res.status(200).send(tokens);

    }catch(err){
        return res.status(500);
    }
}  

const generateTokens = async (user:Document<unknown, object, IUser> & IUser & Required<{ _id: string; }>):Promise<{"accessToken":string, "refreshToken":string}>=>  {
    const accessToken = jwt.sign({id_: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
    const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jwt.sign({id_: user._id, random:random}, process.env.ACCESS_TOKEN_SECRET, {});
    if (user.tokens ==  null){
        user.tokens = [];
    }
    user.tokens.push(refreshToken);
    try{
        await user.save();
        return{
            "accessToken": accessToken,
            "refreshToken": refreshToken
        };
    }catch(err){
        return null
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

        const tokens = await generateTokens(user);
        if (tokens == null){
            return res.status(400).send("Error generating tokens");
        }
        return res.status(200).send(tokens);
    }catch(err){
        return res.status(500).send(err.message);
    }
}

const extractToken = (req: Request):string => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return token;
}

const refresh = async (req: Request, res: Response) => {
    const refreshToken = extractToken(req);
    if (refreshToken == null){
        return res.status(401).send('No token provided');
    }
    try{
        jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, async (err, data :jwt.JwtPayload) => { 
            if (err){
                return res.status(401).send('Token is not valid');
            }
            const id = data.id_;
            const user = await User.findOne({_id: id});
            if (user == null){
                return res.status(401).send('User not found');
            }
            if (!user.tokens.includes(refreshToken)){
                user.tokens = [];
                await user.save();
                return res.status(401).send('Invalid token');
            }
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            const tokens = await generateTokens(user);
            if (tokens == null){
                return res.status(400).send('Error generating tokens');
            }
            return res.status(200).send(tokens);
        });
    }catch(err){
        return res.status(500).send(err.message);
    }
}


const logout = async (req: Request, res: Response) => {
    const refreshToken = extractToken(req);
    if (refreshToken == null){
        return res.status(401).send('No token provided');
    }
    try{
        jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, async (err, data :jwt.JwtPayload) => { 
            if (err){
                return res.status(401).send('Token is not valid');
            }
            const id = data.id_;
            const user = await User.findOne({_id: id});
            if (user == null){
                return res.status(401).send('User not found');
            }
            if (!user.tokens.includes(refreshToken)){
                user.tokens = [];
                await user.save();
                return res.status(401).send('Invalid token');
            }
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            await user.save();
            return res.status(200).send();
        });
    }catch(err){
        return res.status(500).send(err.message);
    }
}   

export const authMiddleware = (req: AuthRequest, res: Response, next:NextFunction) => {
    const token = extractToken(req);
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
    authMiddleware,
    refresh
}