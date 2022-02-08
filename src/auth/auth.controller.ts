import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { UnauthenticatedGuard } from './guards/unauthenticated.guard';
import { UserRegisterPipe } from './pipes/user-register.pipe';
import { UserRegisterInterceptor } from './interceptors/user-register.interceptor';
import { UserRegisterDto } from './dto/user-register.dto';
import { RequestUserInterface } from '../common/request-user-interface';

@Controller()
export class AuthController {
  constructor(private userService: UsersService) {}

  // 2.3.1 Login route
  @UseGuards(UnauthenticatedGuard, LocalAuthGuard)
  @Post('api/auth/login')
  login(
    @Body() loginData: Partial<UserRegisterDto>,
    @Request() req: RequestUserInterface,
  ) {
    return {
      email: req.user.email,
      name: req.user.name,
      contactPhone: req.user.contactPhone,
    };
  }

  // 2.3.2 Logout route
  @UseGuards(AuthenticatedGuard)
  @Post('api/auth/logout')
  logout(@Request() req: RequestUserInterface) {
    req.logout();
    return {};
  }

  // 2.3.3 Registration
  @UseGuards(UnauthenticatedGuard)
  @Post('api/client/register')
  @UseInterceptors(UserRegisterInterceptor)
  @UsePipes(new UserRegisterPipe())
  register(@Body() userData: UserRegisterDto) {
    return this.userService.create(userData);
  }
}
