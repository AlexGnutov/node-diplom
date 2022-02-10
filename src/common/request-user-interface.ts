import { Request } from 'express';
import { User } from '../users/schema/user.interface';
export interface RequestUserInterface extends Request {
  user: User;
}
