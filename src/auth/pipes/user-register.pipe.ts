import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../../roles/role.enum';
import { UserRegisterDto } from '../dto/user-register.dto';

@Injectable()
export class UserRegisterPipe implements PipeTransform {
  async transform(value: any): Promise<UserRegisterDto> {
    const salt = 10;
    value.passwordHash = await bcrypt.hash(value.password, salt);
    value.role = Role.User;
    return {
      email: value.email,
      passwordHash: value.passwordHash,
      name: value.name,
      role: value.role,
      contactPhone: value.contactPhone,
    };
  }
}
