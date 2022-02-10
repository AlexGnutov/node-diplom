import { Document } from 'mongoose';
import { ID } from '../../common/ID';

export interface Hotel extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  id?: ID;
}
