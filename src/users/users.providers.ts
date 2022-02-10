import { Connection } from 'mongoose';
import { UsersSchema } from './schema/users.schema';
import { DataBaseConnectionName, UserModelName } from '../common/constants';

export const UsersProviders = [
  {
    provide: UserModelName,
    useFactory: (connection: Connection) =>
      connection.model('User', UsersSchema),
    inject: [DataBaseConnectionName],
  },
];
