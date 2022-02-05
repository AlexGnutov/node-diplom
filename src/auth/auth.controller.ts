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

interface userRegisterDto {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
}

@Controller()
export class AuthController {
  constructor(private userService: UsersService) {}

  // 2.3.1 Login route
  @UseGuards(UnauthenticatedGuard, LocalAuthGuard)
  @Post('api/auth/login')
  login(@Body() loginData, @Request() req: any) {
    // console.log(' new Data: ', loginData);
    // console.log(req.user);
    return {
      email: req.user.email,
      name: req.user.name,
      contactPhone: req.user.contactPhone,
    };
  }

  // 2.3.2 Logout route
  @UseGuards(AuthenticatedGuard)
  @Post('api/auth/logout')
  logout(@Request() req) {
    req.logout();
    return {};
  }

  // 2.3.3 Registration
  @UseGuards(UnauthenticatedGuard)
  @Post('api/client/register')
  @UseInterceptors(UserRegisterInterceptor)
  @UsePipes(new UserRegisterPipe())
  register(@Body() userData: userRegisterDto) {
    return this.userService.create(userData);
  }

  /*
  // These routes are only for roles check
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/role-check/admin')
  @Roles(Role.Admin)
  checkRoleAdmin() {
    return 'You are admin';
  }
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/role-check/client')
  @Roles(Role.User)
  checkRoleClient() {
    return 'You are client';
  }
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/role-check/manager')
  @Roles(Role.Manager)
  checkRoleManager() {
    return 'You are manager';
  }
  */
}
