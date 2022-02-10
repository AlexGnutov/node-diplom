import { Schema } from 'mongoose';

export const HotelSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
});
