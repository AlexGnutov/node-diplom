import { Connection } from 'mongoose';
import { ReservationSchema } from './schema/reservation.schema';
import {
  DataBaseConnectionName,
  ReservationModelName,
} from '../common/constants';

export const ReservationProviders = [
  {
    provide: ReservationModelName,
    useFactory: (connection: Connection) =>
      connection.model('Reservation', ReservationSchema),
    inject: [DataBaseConnectionName],
  },
];
