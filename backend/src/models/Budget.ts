import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense {
  id: string;
  description: string;
  amount: number;
  category: 'flight' | 'hotel' | 'match' | 'food' | 'transport' | 'other';
  date: Date;
  paidBy: string; // User email or "Me"
  splitWith: string[]; // List of email addresses to split with
}

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId | string;
  tripId: mongoose.Types.ObjectId | string;
  estimatedCost: number;
  actualCost: number;
  expenses: IExpense[];
  createdAt: Date;
}

const ExpenseSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['flight', 'hotel', 'match', 'food', 'transport', 'other'], required: true },
  date: { type: Date, default: Date.now },
  paidBy: { type: String, default: 'Me' },
  splitWith: [{ type: String }]
});

const BudgetSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  estimatedCost: { type: Number, default: 0 },
  actualCost: { type: Number, default: 0 },
  expenses: [ExpenseSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBudget>('Budget', BudgetSchema);
