import { Role } from '../../roles/role.enum';
import {
  IsDefined,
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCreateDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  passwordHash: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  contactPhone: string;

  @IsDefined()
  role: Role;

  @IsEmpty()
  password?: string;
}
