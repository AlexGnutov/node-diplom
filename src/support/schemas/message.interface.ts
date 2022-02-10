import { Document } from 'mongoose';
import { ID } from '../../common/ID';

export interface Message extends Document {
  author: ID;
  sentAt: Date;
  text: string;
  readAt: Date | null;
  id?: ID;
}
