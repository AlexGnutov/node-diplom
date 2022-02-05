import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument, User } from './user.schema';
import { ID } from '../common/ID';
import { InjectModel } from '@nestjs/mongoose';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: ID): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Поле role может принимать одно из следующих значений: client, admin, manager
  public async create(data: Partial<User>): Promise<User> {
    let exist;
    try {
      exist = await this.findByEmail(data.email);
    } catch (e) {
      console.log("DB-error: User.create - can't create", e.message);
      throw new InternalServerErrorException();
    }
    // Check if user exist - if not = bad Request
    if (exist) {
      throw new BadRequestException();
    }
    return this.userModel.create(data);
  }

  public async findById(id: ID): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ _id: id }).exec();
    } catch (e) {
      console.log("DB-error: User.findById - can't find", e.message);
      throw new InternalServerErrorException();
    }
    return user;
  }

  public async findByEmail(email: string): Promise<any> {
    let user;
    try {
      user = await this.userModel.findOne({ email: email }).exec();
    } catch (e) {
      console.log("DB-error: User.findByEmail - can't find", e.message);
      throw new InternalServerErrorException();
    }
    return user;
  }

  public async findAll(params: SearchUserParams): Promise<User[]> {
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
      console.log("DB-error: User.findAll - can't find", e.message);
      throw new InternalServerErrorException();
    }
    return users;
  }
}
