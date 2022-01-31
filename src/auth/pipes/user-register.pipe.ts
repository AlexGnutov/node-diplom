import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../../roles/role.enum';

@Injectable()
export class UserRegisterPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const salt = 10;
    value.passwordHash = await bcrypt.hash(value.password, salt);
    value.role = Role.User;
    // console.log('from pipe: ', value);
    return value;
  }
}
