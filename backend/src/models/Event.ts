import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: Date;
  venueName: string;
  status: 'scheduled' | 'live' | 'completed';
  group?: string;
}

export interface IVenue {
  name: string;
  city: string;
  country: string;
  capacity?: number;
  lat?: number;
  lng?: number;
  info?: string;
  nearbyRestaurants?: string[];
  nearbyHotels?: string[];
}

export interface IEvent extends Document {
  title: string;
  sport: 'Soccer' | 'Cricket' | 'Olympics' | 'Other';
  year: number;
  startDate: Date;
  endDate: Date;
  matches: IMatch[];
  venues: IVenue[];
}

const MatchSchema = new Schema({
  id: { type: String, required: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeScore: { type: Number },
  awayScore: { type: Number },
  date: { type: Date, required: true },
  venueName: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
  group: { type: String }
});

const VenueSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  capacity: { type: Number },
  lat: { type: Number },
  lng: { type: Number },
  info: { type: String },
  nearbyRestaurants: [{ type: String }],
  nearbyHotels: [{ type: String }]
});

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  sport: { type: String, enum: ['Soccer', 'Cricket', 'Olympics', 'Other'], required: true },
  year: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  matches: [MatchSchema],
  venues: [VenueSchema]
});

export default mongoose.model<IEvent>('Event', EventSchema);
