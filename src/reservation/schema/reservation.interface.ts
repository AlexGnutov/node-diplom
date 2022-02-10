import { Document } from 'mongoose';
import { ID } from '../../common/ID';

export interface Reservation extends Document {
  userId: ID;
  hotelId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
  id?: ID;
}
