import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for a Comment document
export interface IComment extends Document {
  userID: string;
  username: string;
  text: string;
}

// Define the Comment schema
const CommentSchema: Schema<IComment> = new Schema({
  userID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

// Explicitly define the Comment model with Model<IComment>
const Comment: Model<IComment> = mongoose.model<IComment>(
  'Comment',
  CommentSchema
);

export default Comment;
