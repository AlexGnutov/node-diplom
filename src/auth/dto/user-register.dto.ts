import {
  IsDefined,
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../../roles/role.enum';

export class UserRegisterDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  passwordHash: string;

  @IsOptional()
  name: string;

  @IsOptional()
  contactPhone?: string;

  @IsEmpty()
  password?: string;

  @IsDefined()
  role: Role;
}
