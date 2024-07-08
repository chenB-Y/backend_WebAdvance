import mongoose from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  amount: number;
  imageUrl: string;
  ownerId: string;
  comments: [string];
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  ownerId:{
    type: String,
    required:true,
  },
  comments:{
    type: [String],
  },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
