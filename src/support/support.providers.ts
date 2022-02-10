import { Connection } from 'mongoose';
import { MessageSchema } from './schemas/message.schema';
import { SupportRequestSchema } from './schemas/support-request.schema';
import {
  DataBaseConnectionName,
  MessageModelName,
  SupportRequestModelName,
} from '../common/constants';

export const SupportProviders = [
  {
    provide: MessageModelName,
    useFactory: (connection: Connection) =>
      connection.model('Message', MessageSchema),
    inject: [DataBaseConnectionName],
  },
  {
    provide: SupportRequestModelName,
    useFactory: (connection: Connection) =>
      connection.model('SupportRequest', SupportRequestSchema),
    inject: [DataBaseConnectionName],
  },
];
