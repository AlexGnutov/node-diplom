import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from './schema/hotel.schema';
import { ID } from '../common/ID';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelsQueryParamsDto } from './dto/hotels-query-params.dto';

interface IHotelService {
  create(data: CreateHotelDto): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: Pick<Hotel, 'title'>): Promise<Hotel[]>;
  update(id: ID, data: CreateHotelDto): Promise<Hotel>;
}

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  public async create(data: CreateHotelDto): Promise<Hotel> {
    const newHotel = new this.hotelModel({
      title: data.title,
      description: data.description,
      createdAt: new Date(),
    });
    return newHotel.save();
  }

  public async findById(id: ID): Promise<Hotel> {
    return this.hotelModel.findById(id).exec();
  }

  public async search(params: HotelsQueryParamsDto): Promise<Hotel[]> {
    const options = {
      limit: params.limit ? params.limit : null,
      skip: params.offset ? params.offset : null,
    };

    const filter = params.title
      ? { title: new RegExp('.*' + params.title + '.*') }
      : null;
    const projection = 'id title description';
    return this.hotelModel.find(filter, projection, options).exec();
  }

  public async update(id: ID, data: CreateHotelDto): Promise<Hotel> {
    data['updatedAt'] = new Date();
    return await this.hotelModel
      .findOneAndUpdate({ id }, data, { new: true })
      .exec();
  }
}
