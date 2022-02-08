import { Request } from 'express';
import { UserInterface } from './user-interface';
export interface RequestUserInterface extends Request {
  user: UserInterface;
}
