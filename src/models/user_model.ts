import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  imgUrl?: string;
  tokens: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },
  tokens: {
    type: [String],
  },
});

export default mongoose.model<IUser>('User', UserSchema);
