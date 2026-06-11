import mongoose, { Schema, Document } from 'mongoose';

export interface IHistoryItem extends Document {
  userId: mongoose.Types.ObjectId | string;
  query: string;
  response: string;
  steps: {
    title: string;
    description: string;
    status: 'success' | 'warning' | 'error' | 'pending';
    duration?: string;
  }[];
  createdAt: Date;
}

const HistorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  response: { type: String, required: true },
  steps: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['success', 'warning', 'error', 'pending'], default: 'success' },
    duration: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IHistoryItem>('History', HistorySchema);
