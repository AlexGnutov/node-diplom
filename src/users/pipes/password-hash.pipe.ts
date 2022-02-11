import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  async transform(value: any) {
    const salt = 10;
    value.passwordHash = await bcrypt.hash(value.password, salt);
    return {
      email: value.email,
      passwordHash: value.passwordHash,
      name: value.name,
      role: value.role,
      contactPhone: value.contactPhone,
    };
  }
}
