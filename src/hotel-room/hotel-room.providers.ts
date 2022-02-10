import { Connection } from 'mongoose';
import { HotelRoomSchema } from './schema/hotel-room.schema';
import {
  DataBaseConnectionName,
  HotelRoomModelName,
} from '../common/constants';

export const HotelRoomProviders = [
  {
    provide: HotelRoomModelName,
    useFactory: (connection: Connection) =>
      connection.model('HotelRoom', HotelRoomSchema),
    inject: [DataBaseConnectionName],
  },
];
