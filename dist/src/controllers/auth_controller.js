"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (email === undefined || password === undefined) {
        return res.status(400).send('Email or password not provided');
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).send('User already exists');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_model_1.default.create({
            email: email,
            password: hashedPassword,
        });
        //res.send(newUser);
        // add login logic here
        const tokens = yield generateTokens(newUser);
        if (tokens == null) {
            return res.status(400).send('Error generating tokens');
        }
        return res.status(200).send(newUser);
    }
    catch (err) {
        return res.status(500);
    }
});
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign({ id_: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jsonwebtoken_1.default.sign({ id_: user._id, random: random }, process.env.ACCESS_TOKEN_SECRET, {});
    if (user.tokens == null) {
        user.tokens = [];
    }
    user.tokens.push(refreshToken);
    try {
        yield user.save();
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
    catch (err) {
        return null;
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (email === undefined || password === undefined) {
        return res.status(400).send('Email or password not provided');
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send('User does not exists');
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).send('Invalid Credentials');
        }
        const tokens = yield generateTokens(user);
        if (tokens == null) {
            return res.status(400).send('Error generating tokens');
        }
        return res.status(200).send(tokens);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});
const extractToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return token;
};
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = extractToken(req);
    if (refreshToken == null) {
        return res.status(401).send('No token provided1');
    }
    try {
        jsonwebtoken_1.default.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(401).send('Token is not valid');
            }
            const id = data.id_;
            const user = yield user_model_1.default.findOne({ _id: id });
            if (user == null) {
                return res.status(401).send('User not found');
            }
            if (!user.tokens.includes(refreshToken)) {
                user.tokens = [];
                yield user.save();
                return res.status(401).send('Invalid token');
            }
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            const tokens = yield generateTokens(user);
            if (tokens == null) {
                return res.status(400).send('Error generating tokens');
            }
            return res.status(200).send(tokens);
        }));
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = extractToken(req);
    if (refreshToken == null) {
        return res.status(401).send('No token provided2');
    }
    try {
        jsonwebtoken_1.default.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(401).send('Token is not valid');
            }
            const id = data.id_;
            const user = yield user_model_1.default.findOne({ _id: id });
            if (user == null) {
                return res.status(401).send('User not found');
            }
            if (!user.tokens.includes(refreshToken)) {
                user.tokens = [];
                yield user.save();
                return res.status(401).send('Invalid token');
            }
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            yield user.save();
            return res.status(200).send();
        }));
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});
const authMiddleware = (req, res, next) => {
    const token = extractToken(req);
    if (token == null) {
        return res.status(401).send('No token provided3');
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(401).send('Token is not valid');
        }
        const id = data.id_;
        req.user = { _id: id };
        return next();
    });
};
exports.authMiddleware = authMiddleware;
exports.default = {
    register,
    login,
    logout,
    authMiddleware: exports.authMiddleware,
    refresh,
};
//# sourceMappingURL=auth_controller.js.map