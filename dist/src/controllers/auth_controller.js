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
        const newUser = yield user_model_1.default.create({ email: email, password: hashedPassword });
        res.send(newUser);
    }
    catch (err) {
        return res.status(500).send(err.message);
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
            res.status(400).send("Invalid Credentials");
        }
        const accessToken = jsonwebtoken_1.default.sign({ id_: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(200).send({ token: accessToken });
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});
const logout = (req, res) => {
    res.send('logout');
};
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send('No token provided');
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
    authMiddleware: exports.authMiddleware
};
//# sourceMappingURL=auth_controller.js.map