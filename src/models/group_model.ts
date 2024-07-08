import mongoose from 'mongoose';

export interface IGroup {
  name: string;
  participants: string[];
  products: string[];
}

const GroupSchema = new mongoose.Schema<IGroup>({
  name: {
    type: String,
    required: true,
  },
  participants: {
    type: [String],
    required: true,
  },
  products: {
    type: [String],
  },
});

export default mongoose.model<IGroup>('Group', GroupSchema);