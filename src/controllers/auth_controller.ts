import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

export type AuthRequest = Request & { user: { _id: string } };

const client = new OAuth2Client();
const googleSignin = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('payload:', payload);
    const email = payload?.email;
    if (email != null) {
      let user = await User.findOne({ email: email });
      if (user == null) {
        user = await User.create({
          email: email,
          username: payload?.name,
          password: '0',
          imgUrl: payload?.picture,
        });
      }
      console.log('user:', user);
      const tokens = await generateTokens(user); //******************************/
      res.status(200).send({
        username: user.username,
        userID: user._id,
        ...tokens,
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const register = async (req: AuthRequest, res: Response) => {
  const imgUrl = req.body.imgUrl;
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  if (email === undefined || password === undefined) {
    return res.status(400).send('Email or password not provided');
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
      imgUrl: imgUrl,
    });
    //res.send(newUser);
    // add login logic here
    const tokens = await generateTokens(newUser); //******************************/
    if (tokens == null) {
      return res.status(400).send('Error generating tokens');
    }
    const response = {
      groupID: newUser.groupID,
      username: newUser.username,
      userID: newUser._id,
      ...tokens,
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500);
  }
};

const generateTokens = async (
  user: Document<unknown, object, IUser> & IUser & Required<{ _id: string }>
): Promise<{
  accessToken: string;
  refreshToken: string;
  // userID: string;
  // groupID: string;
  // username: string;
}> => {
  user.tokens = [];
  const accessToken = jwt.sign(
    { id_: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
  );
  console.log('accessToken:', accessToken);
  //const random = Math.floor(Math.random() * 1000000).toString();
  const refreshToken = jwt.sign(
    { id_: user._id },
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log('refreshToken:', refreshToken);
  if (user.tokens == null) {
    user.tokens = [];
  }
  user.tokens.push(accessToken);
  user.tokens.push(refreshToken);
  try {
    await user.save();
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      // userID: user._id,
      // groupID: user.groupID,
      // username: user.username,
    };
  } catch (err) {
    return null;
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === undefined || password === undefined) {
    return res.status(400).send('Email or password not provided');
  }
  try {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(400).send('User does not exists');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid Credentials');
    }

    const tokens = await generateTokens(user); //******************************/
    console.log('user:', user);
    if (tokens == null) {
      return res.status(400).send('Error generating tokens');
    }
    const response = {
      groupID: user.groupID,
      username: user.username,
      userID: user._id,
      ...tokens,
    };
    console.log('*********************************:', tokens);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const extractToken = (req: Request): string => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token;
};

const refresh = async (req: Request, res: Response) => {
  console.log('hellooooooooo refreshhhhhhhhhhhhhhhhh');
  console.log('req:', req.headers);
  console.log(
    '***************************************************************************'
  );
  const refreshToken = req.headers['refreshtoken'];

  console.log('refreshTokenHeader:', refreshToken);
  if (refreshToken == null) {
    return res.status(401).send('No token provided1');
  }
  console.log('111111111111111111111111111111111111111');
  console.log('refreshToken:', refreshToken);
  try {
    console.log('3333333333333333333333333333333333');
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, data: jwt.JwtPayload) => {
        if (err) {
          console.log('err:', err);
          console.log('4444444444444444444444444444444444444444');
          return res.status(401).send('Token is not valid');
        }
        console.log('55555555555555555555555555555555555555555555');
        const id = data.id_;
        const user = await User.findOne({ _id: id });
        if (user == null) {
          return res.status(401).send('User not found');
        }
        console.log('666666666666666666666666666666666666666666');
        console.log('user:', user.tokens);
        if (!user.tokens.includes(refreshToken.toString())) {
          console.log('77777777777777777777777777777777777777');
          user.tokens = [];
          await user.save();
          return res.status(401).send('Invalid token');
        }
        console.log('888888888888888888888888888888888888888888888888');
        user.tokens = user.tokens.filter((token) => token !== refreshToken);
        const tokens = await generateTokens(user); //***********NOOOOO Updated!*************/
        if (tokens == null) {
          return res.status(400).send('Error generating tokens');
        }
        console.log('99999999999999999999999999999999999999999');
        return res.status(200).send(tokens);
      }
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = extractToken(req);
  if (refreshToken == null) {
    return res.status(401).send('No token provided2');
  }
  try {
    jwt.verify(
      refreshToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, data: jwt.JwtPayload) => {
        if (err) {
          return res.status(401).send('Token is not valid');
        }
        const id = data.id_;
        const user = await User.findOne({ _id: id });
        if (user == null) {
          return res.status(401).send('User not found');
        }
        if (!user.tokens.includes(refreshToken)) {
          user.tokens = [];
          await user.save();
          return res.status(401).send('Invalid token');
        }
        user.tokens = user.tokens.filter((token) => token !== refreshToken);
        await user.save();
        return res.status(200).send();
      }
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req);
  if (token == null) {
    return res.status(401).send('No token provided3');
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, data: jwt.JwtPayload) => {
      if (err) {
        return res.status(401).send('Token is not valid');
      }
      const id = data.id_;
      req.user = { _id: id };
      return next();
    }
  );
};

export const getUserData = async (req: Request, res: Response) => {
  if (req.params.id != null) {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).send('User not found');
    }
    console.log('user:', user);
    return res.status(200).send(user);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { userID, newUsername, url } = req.body;
  console.log('userID:', userID, 'newUsername:', newUsername, 'url:', url);

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // If there's a current image URL, remove the old image file
    if (user.imgUrl) {
      const imagePath = path.join(
        './public/users',
        user.imgUrl.split('localhost:3000/')[1]
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting old image:', err);
        } else {
          console.log('Old image deleted:', imagePath);
        }
      });
    }

    // Update the username and image URL fields
    if (newUsername) user.username = newUsername;
    if (url) user.imgUrl = url;
    await user.save(); // Save the updated user object

    return res.status(200).send(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).send('Error updating profile');
  }
};

export default {
  googleSignin,
  register,
  login,
  logout,
  getUserData,
  updateProfile,
  authMiddleware,
  refresh,
};
