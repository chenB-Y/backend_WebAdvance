import { Document, Schema, Model, model } from 'mongoose';

export interface IProduct extends Document{
  _id: string;
  name: string;
  amount: number;
  imageUrl: string;
  ownerId: string;
  comments: [string];
}

const ProductSchema = new Schema<IProduct>({
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

const Product: Model<IProduct> = model<IProduct>('Product', ProductSchema);

export default Product;
