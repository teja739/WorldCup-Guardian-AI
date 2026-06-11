import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginHistory {
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

export interface IUser extends Document {
  googleId?: string;
  name: string;
  email: string;
  picture?: string;
  favoriteSport?: string;
  favoriteTeam?: string;
  budgetPreference?: string;
  languagePreference?: string;
  loginHistory?: ILoginHistory[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  favoriteSport: { type: String, default: 'Soccer' },
  favoriteTeam: { type: String, default: 'Any' },
  budgetPreference: { type: String, default: 'Moderate' },
  languagePreference: { type: String, default: 'English' },
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    userAgent: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
