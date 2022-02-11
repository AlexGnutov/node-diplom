import { Schema } from 'mongoose';

export const HotelRoomSchema = new Schema({
  hotelId: {
    required: true,
    type: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
  },
  title: { type: String },
  description: { type: String },
  images: { type: [String] },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
  isEnabled: { type: Boolean, default: true },
});
