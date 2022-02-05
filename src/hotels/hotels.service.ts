import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    let hotel;
    try {
      hotel = await this.hotelModel.create({
        title: data.title,
        description: data.description,
        createdAt: new Date(),
      });
    } catch (e) {
      console.log("DB-error: Hotel:create - can't create", e.message);
      throw new InternalServerErrorException();
    }
    return hotel;
  }

  public async findById(id: ID): Promise<Hotel> {
    let hotel;
    try {
      hotel = this.hotelModel.findById(id).exec();
    } catch (e) {
      console.log("DB-error: Hotel:findById - can't find", e.message);
      throw new InternalServerErrorException();
    }
    return hotel;
  }

  public async search(params: HotelsQueryParamsDto): Promise<Hotel[]> {
    // Check, if options were sent
    const options = {
      limit: params.limit ? params.limit : null,
      skip: params.offset ? params.offset : null,
    };
    // Create filter + projection (old style - better to combine data in interceptor)
    const filter = params.title
      ? { title: new RegExp('.*' + params.title + '.*') }
      : null;
    const projection = 'id title description';
    // Find hotels
    let hotels;
    try {
      hotels = this.hotelModel.find(filter, projection, options).exec();
    } catch (e) {
      console.log("DB-error: Hotel:search - can't find", e.message);
      throw new InternalServerErrorException();
    }
    return hotels;
  }

  public async update(id: ID, data: CreateHotelDto): Promise<Hotel> {
    // Fix date of update
    data['updatedAt'] = new Date();
    let updated;
    try {
      updated = await this.hotelModel
        .findOneAndUpdate({ id }, data, { new: true })
        .exec();
    } catch (e) {
      console.log("DB-error: Hotel:update - can't do", e.message);
      throw new InternalServerErrorException();
    }
    return updated;
  }
}
