import { Schema } from 'mongoose';

export const SupportRequestSchema = new Schema({
  user: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  },
  createdAt: { type: Date, required: true },
  messages: {
    type: [{ type: [Schema.Types.ObjectId], ref: 'Message' }],
    required: true,
  },
  isActive: { type: Boolean },
});
