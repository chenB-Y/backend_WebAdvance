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
exports.updateProfile = exports.getUserData = exports.authMiddleware = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client = new google_auth_library_1.OAuth2Client();
const googleSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log('payload:', payload);
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_model_1.default.findOne({ email: email });
            if (user == null) {
                user = yield user_model_1.default.create({
                    email: email,
                    username: payload === null || payload === void 0 ? void 0 : payload.name,
                    password: '0',
                    imgUrl: payload === null || payload === void 0 ? void 0 : payload.picture,
                });
            }
            console.log('user:', user);
            const tokens = yield generateTokens(user); //******************************/
            res.status(200).send(Object.assign({ username: user.username, userID: user._id }, tokens));
        }
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imgUrl = req.body.imgUrl;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
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
            username: username,
            password: hashedPassword,
            imgUrl: imgUrl,
        });
        //res.send(newUser);
        // add login logic here
        const tokens = yield generateTokens(newUser); //******************************/
        if (tokens == null) {
            return res.status(400).send('Error generating tokens');
        }
        const response = Object.assign({ groupID: newUser.groupID, username: newUser.username, userID: newUser._id }, tokens);
        return res.status(200).send(response);
    }
    catch (err) {
        return res.status(500);
    }
});
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.tokens = [];
    const accessToken = jsonwebtoken_1.default.sign({ id_: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    console.log('accessToken:', accessToken);
    //const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jsonwebtoken_1.default.sign({ id_: user._id }, process.env.REFRESH_TOKEN_SECRET);
    console.log('refreshToken:', refreshToken);
    if (user.tokens == null) {
        user.tokens = [];
    }
    user.tokens.push(accessToken);
    user.tokens.push(refreshToken);
    try {
        yield user.save();
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            // userID: user._id,
            // groupID: user.groupID,
            // username: user.username,
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
            return res.status(400).send('Invalid Credentials');
        }
        const tokens = yield generateTokens(user); //******************************/
        console.log('user:', user);
        if (tokens == null) {
            return res.status(400).send('Error generating tokens');
        }
        const response = Object.assign({ groupID: user.groupID, username: user.username, userID: user._id }, tokens);
        console.log('*********************************:', tokens);
        return res.status(200).send(response);
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
    console.log('hellooooooooo refreshhhhhhhhhhhhhhhhh');
    console.log('req:', req.headers);
    console.log('***************************************************************************');
    const refreshToken = req.headers['refreshtoken'];
    console.log('refreshTokenHeader:', refreshToken);
    if (refreshToken == null) {
        return res.status(401).send('No token provided1');
    }
    console.log('111111111111111111111111111111111111111');
    console.log('refreshToken:', refreshToken);
    try {
        console.log('3333333333333333333333333333333333');
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log('err:', err);
                console.log('4444444444444444444444444444444444444444');
                return res.status(401).send('Token is not valid');
            }
            console.log('55555555555555555555555555555555555555555555');
            const id = data.id_;
            const user = yield user_model_1.default.findOne({ _id: id });
            if (user == null) {
                return res.status(401).send('User not found');
            }
            console.log('666666666666666666666666666666666666666666');
            console.log('user:', user.tokens);
            if (!user.tokens.includes(refreshToken.toString())) {
                console.log('77777777777777777777777777777777777777');
                user.tokens = [];
                yield user.save();
                return res.status(401).send('Invalid token');
            }
            console.log('888888888888888888888888888888888888888888888888');
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            const tokens = yield generateTokens(user); //***********NOOOOO Updated!*************/
            if (tokens == null) {
                return res.status(400).send('Error generating tokens');
            }
            console.log('99999999999999999999999999999999999999999');
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
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id != null) {
        const user = yield user_model_1.default.findById(req.params.id);
        if (user == null) {
            return res.status(404).send('User not found');
        }
        console.log('user:', user);
        return res.status(200).send(user);
    }
});
exports.getUserData = getUserData;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, newUsername, url } = req.body;
    console.log('userID:', userID, 'newUsername:', newUsername, 'url:', url);
    try {
        console.log("11111111111111111444444444444411111111111111111111111111111111111");
        const user = yield user_model_1.default.findById(userID);
        console.log("2222222222222222222222222222222244444444444444422222222222222222222");
        if (!user) {
            return res.status(404).send('User not found');
        }
        // If there's a current image URL, remove the old image file
        if (user.imgUrl !== url) {
            console.log("333333333333333334444444444444444444444333333333333333");
            const imagePath = path_1.default.join('./public/users', user.imgUrl.split('10.10.248.174:4000/')[1]);
            console.log("4444444444444444444000000000000004444444444444444444444444444444444");
            fs_1.default.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                }
                else {
                    console.log('Old image deleted:', imagePath);
                }
            });
        }
        // Update the username and image URL fields
        if (newUsername)
            user.username = newUsername;
        if (url)
            user.imgUrl = url;
        yield user.save(); // Save the updated user object
        return res.status(200).send(user);
    }
    catch (err) {
        console.error('Error updating profile:', err);
        return res.status(500).send('Error updating profile');
    }
});
exports.updateProfile = updateProfile;
exports.default = {
    googleSignin,
    register,
    login,
    logout,
    getUserData: exports.getUserData,
    updateProfile: exports.updateProfile,
    authMiddleware: exports.authMiddleware,
    refresh,
};
//# sourceMappingURL=auth_controller.js.map