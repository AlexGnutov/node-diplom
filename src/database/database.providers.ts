import * as mongoose from 'mongoose';
import { DataBaseConnectionName } from '../common/constants';

const options = {
  user: process.env.DB_USERNAME || 'user',
  pass: process.env.DB_PASSWORD || 'password',
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbURL = process.env.DB_HOST || 'mongodb://localhost:8082';

export const databaseProviders = [
  {
    provide: DataBaseConnectionName,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(dbURL, options),
  },
];
