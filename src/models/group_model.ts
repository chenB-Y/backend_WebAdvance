// Group.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import  { IProduct } from './Product_model'; // Import IProduct interface from Product_model

export interface IGroup extends Document {
  name: string;
  participants: string[];
  products: IProduct[];
}

const GroupSchema: Schema<IGroup> = new Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  participants: {
    type: [String],
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

const Group: Model<IGroup> = mongoose.model<IGroup>('Group', GroupSchema);

export default Group;
