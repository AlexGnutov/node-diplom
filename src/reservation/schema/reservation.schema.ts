import { Schema } from 'mongoose';

export const ReservationSchema = new Schema({
  userId: {
    required: true,
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  hotelId: {
    required: true,
    type: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
  },
  roomId: {
    required: true,
    type: [{ type: Schema.Types.ObjectId, ref: 'HotelRoom' }],
  },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
});
