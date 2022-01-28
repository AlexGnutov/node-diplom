import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const salt = 10;
    value.passwordHash = await bcrypt.hash(value.password, salt);
    console.log('from pipe: ', value);
    return value;
  }
}
