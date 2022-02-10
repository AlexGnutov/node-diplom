import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ID } from '../common/ID';
import { User } from './schema/user.interface';
import { UserModelName } from '../common/constants';
import { SearchUserParamsDto } from './dto/search.user.params.dto';

interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: ID): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParamsDto): Promise<User[]>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject(UserModelName)
    private userModel: Model<User>,
  ) {}

  public async create(data: Partial<User>): Promise<User> {
    let exist;
    try {
      exist = await this.findByEmail(data.email);
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: User.create - can't create",
      );
    }
    // Check if user exist - if yes = bad Request
    if (exist) {
      throw new BadRequestException(
        "Can't register: email is already occupied",
      );
    }
    return this.userModel.create(data);
  }

  public async findById(id: ID): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findOne({ _id: id }).exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: User.findById - can't find",
      );
    }
    return user;
  }

  public async findByEmail(email: string): Promise<any> {
    let user: User;
    try {
      user = await this.userModel.findOne({ email: email }).exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: User.findByEmail - can't find",
      );
    }
    return user;
  }

  public async findAll(params: SearchUserParamsDto): Promise<User[]> {
    // Set options (have to change offset to skip!)
    const { limit, offset } = params;
    const options = {
      limit: limit ? limit : null,
      skip: offset ? offset : null,
    };
    // Set search result fields
    const projection = 'id email name contactPhone';
    // Set regexp filter - we use RegExp to allow partial matching
    const filter = {};
    const searchQueries: string[] = ['email', 'name', 'contactPhone'];
    searchQueries.forEach((qname) => {
      if (params[qname]) {
        filter[qname] = new RegExp('.*' + params[qname] + '.*');
      }
    });
    // If role is declared in route, use it in filter
    if (params['role']) {
      filter['role'] = params['role'];
    }
    // Return search result []
    let users;
    try {
      users = this.userModel.find(filter, projection, options).exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: User.findAll - can't find",
      );
    }
    return users;
  }
}
