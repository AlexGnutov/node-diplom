import { Role } from '../roles/role.enum';

export interface UserInterface {
  id: string;
  email: string;
  role: Role;
  contactPhone?: string;
  name?: string;
}
