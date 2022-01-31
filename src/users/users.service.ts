import {BadRequestException, Injectable, ParamData, UnauthorizedException} from '@nestjs/common';
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
    const exist = await this.findByEmail(data.email);
    if (exist) {
      throw new BadRequestException();
    }
    return this.userModel.create(data);
  }

  public async findById(id: ID): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  public async findByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email: email }).exec();
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

    // Set regexp filter
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
    // Return search result array
    return this.userModel.find(filter, projection, options).exec();
  }
}
