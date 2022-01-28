import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserSessionDto } from './dto/user-session.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserSessionDto | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const compareResult: boolean = await bcrypt.compare(
      password,
      user.passwordHash,
    );
    if (user.email === email && compareResult) {
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }
    return null;
  }
}
