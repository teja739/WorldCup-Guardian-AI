import mongoose, { Schema, Document } from 'mongoose';

export interface IItineraryItem {
  id: string;
  day: number;
  time: string;
  type: 'flight' | 'hotel' | 'match' | 'food' | 'sightseeing' | 'other';
  title: string;
  description: string;
  location?: string;
  cost?: number;
}

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId | string;
  event: string;
  destination: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed';
  itinerary: IItineraryItem[];
  groupMembers: string[]; // Email addresses of friends
  meetingPoints?: { name: string; lat?: number; lng?: number; time?: string }[];
  createdAt: Date;
}

const ItineraryItemSchema = new Schema({
  id: { type: String, required: true },
  day: { type: Number, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['flight', 'hotel', 'match', 'food', 'sightseeing', 'other'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  cost: { type: Number, default: 0 }
});

const TripSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  destination: { type: String, required: true },
  budget: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['planned', 'active', 'completed'], default: 'planned' },
  itinerary: [ItineraryItemSchema],
  groupMembers: [{ type: String }],
  meetingPoints: [{
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    time: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITrip>('Trip', TripSchema);
