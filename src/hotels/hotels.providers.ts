import { Connection } from 'mongoose';
import { HotelSchema } from './schema/hotel.schema';
import { DataBaseConnectionName, HotelModelName } from '../common/constants';

export const HotelsProviders = [
  {
    provide: HotelModelName,
    useFactory: (connection: Connection) =>
      connection.model('Hotel', HotelSchema),
    inject: [DataBaseConnectionName],
  },
];
