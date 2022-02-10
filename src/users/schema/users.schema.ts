import { Schema } from 'mongoose';

export const UsersSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  contactPhone: { type: String },
  role: { type: String, required: true },
});
