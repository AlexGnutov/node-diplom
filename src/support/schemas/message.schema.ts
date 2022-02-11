import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export const MessageSchema = new Schema({
  author: {
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  sentAt: { type: Date, required: true },
  text: { type: String, required: true },
  readAt: { type: Date },
});
