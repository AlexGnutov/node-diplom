import { Document } from 'mongoose';
import { ID } from '../../common/ID';

export interface HotelRoom extends Document {
  hotelId: ID;
  title: string;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
  id?: ID;
}
