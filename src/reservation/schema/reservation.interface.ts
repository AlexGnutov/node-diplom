import { Document } from 'mongoose';
import { ID } from '../../common/ID';
import { Hotel } from '../../hotels/schema/hotel.interface';
import { HotelRoom } from '../../hotel-room/schema/hotel-room.interface';

export interface Reservation extends Document {
  userId: ID;
  hotelId: ID | Hotel[];
  roomId: ID | HotelRoom[];
  dateStart: Date;
  dateEnd: Date;
  id?: ID;
}
