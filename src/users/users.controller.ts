import { Body, Controller, Get, Post, Query, UseInterceptors, UsePipes} from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { SearchUserParams, UsersService } from './users.service';
import { PasswordHashPipe} from "./pipes/password-hash.pipe";
import { CreateUserInterceptor} from "./interceptors/create-user.interceptor";
import { Role } from 'src/roles/role.enum';

interface UserCreateDto {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
  role: Role;
}

@Controller('')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не соответствует
  @Post('api/admin/users')
  @Roles(Role.Admin) // add roles restriction
  @UseInterceptors(CreateUserInterceptor)
  @UsePipes(new PasswordHashPipe())
  createUser(@Body() userCreateData: UserCreateDto) {
    console.log('create user called');
    return this.usersService.create(userCreateData);
  }

  @Get('api/admin/users')
  @Roles(Role.Admin) // add roles restriction
  getUsersList(@Query() queryData: SearchUserParams) {
    queryData['role'] = undefined;
    return this.usersService.findAll(queryData);
  }

  @Get('api/manager/users')
  @Roles(Role.Manager) // add roles restriction
  getClientsList(@Query() queryData: SearchUserParams) {
    queryData['role'] = 'client';
    return this.usersService.findAll(queryData);
  }
}
