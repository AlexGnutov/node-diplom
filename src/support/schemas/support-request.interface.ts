import { Document } from 'mongoose';
import { ID } from '../../common/ID';
import { Message } from './message.interface';

export interface SupportRequest extends Document {
  user: ID;
  createdAt: Date;
  required: true;
  messages: Message[];
  isActive: boolean;
  id?: string;
}
