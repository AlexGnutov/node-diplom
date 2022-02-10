import { Document } from 'mongoose';
import { ID } from '../../common/ID';

export interface User extends Document {
  email: string;
  passwordHash: string;
  name: string;
  contactPhone?: string;
  role: string;
  id?: ID;
}
