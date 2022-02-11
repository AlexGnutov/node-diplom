import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { UsersService } from './users.service';
import { PasswordHashPipe } from './pipes/password-hash.pipe';
import { CreateUserInterceptor } from './interceptors/create-user.interceptor';
import { Role } from 'src/roles/role.enum';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RolesGuard } from '../roles/roles.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { SearchUserParamsDto } from './dto/search.user.params.dto';
import { UserCreateDto } from './dto/user.create.dto';

@Controller('')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 2.4.1 Create new user
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('api/admin/users')
  @Roles(Role.Admin) // add roles restriction
  @UseInterceptors(CreateUserInterceptor)
  @UsePipes(new PasswordHashPipe()) // password hashed in pipe
  createUser(@Body(new ValidationPipe()) userCreateData: UserCreateDto) {
    return this.usersService.create(userCreateData);
  }

  // 2.4.2 Get users list for admin
  // no interceptor - all done by mongoose means in findAll
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/admin/users')
  @Roles(Role.Admin) // add roles restriction
  getUsersList(@Query(new ValidationPipe()) queryData: SearchUserParamsDto) {
    queryData.role = undefined;
    return this.usersService.findAll(queryData);
  }

  // 2.4.2. Get users list for manager
  // no interceptor - all done by mongoose means in findAll
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/manager/users')
  @Roles(Role.Manager) // add roles restriction
  getClientsList(@Query(new ValidationPipe()) queryData: SearchUserParamsDto) {
    queryData.role = Role.User;
    return this.usersService.findAll(queryData);
  }
}
