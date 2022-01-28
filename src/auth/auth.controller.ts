import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { UnauthenticatedGuard } from './guards/unauthenticated.guard';
import { RolesGuard } from '../roles/roles.guard';

interface userRegisterDto {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
}

@Controller()
export class AuthController {
  constructor(private userService: UsersService) {}

  // Доступно только не аутентифицированным пользователям.
  @UseGuards(UnauthenticatedGuard, LocalAuthGuard)
  @Post('api/auth/login')
  login(
    @Body() loginData /*: Pick<userRegisterDto, 'email' | 'password'>*/,
    @Request() req: any,
  ) {
    console.log(' new Data: ', loginData);
    console.log(req.user);
    return 'logged in';
  }

  // Доступно только аутентифицированным пользователям.
  @UseGuards(AuthenticatedGuard)
  @Post('api/auth/logout')
  logout(@Request() req) {
    req.logout();
    return 'Logged out';
  }

  @UseGuards(UnauthenticatedGuard)
  @Post('api/client/register')
  register(@Body() userData: userRegisterDto) {
    return 'register launched';
  }
  // 400 - если email уже занят

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
}
