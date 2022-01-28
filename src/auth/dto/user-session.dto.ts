import { Role } from '../../roles/role.enum';

export interface UserSessionDto {
  id: string;
  name: string;
  email: string;
  role: Role;
}
