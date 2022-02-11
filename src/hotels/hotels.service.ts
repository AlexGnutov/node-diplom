import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Hotel } from './schema/hotel.interface';
import { ID } from '../common/ID';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelsQueryParamsDto } from './dto/hotels-query-params.dto';
import { HotelModelName } from '../common/constants';
import { UpdateHotelDto } from './dto/update-hotel.dto';

interface IHotelService {
  create(data: CreateHotelDto): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: Pick<Hotel, 'title'>): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelDto): Promise<Hotel>;
}

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @Inject(HotelModelName)
    private hotelModel: Model<Hotel>,
  ) {}

  public async create(data: CreateHotelDto): Promise<Hotel> {
    let hotel: Hotel;
    try {
      hotel = await this.hotelModel.create({
        title: data.title,
        description: data.description,
        createdAt: new Date(),
      });
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: Hotel:create - can't create",
      );
    }
    return hotel;
  }

  public async findById(id: ID): Promise<Hotel> {
    let hotel: Hotel;
    try {
      hotel = await this.hotelModel.findById(id).exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: Hotel:findById - can't find",
      );
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
    let hotels: Hotel[];
    try {
      hotels = await this.hotelModel.find(filter, projection, options).exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: Hotel:search - can't find",
      );
    }
    return hotels;
  }

  public async update(hotelId: ID, data: UpdateHotelDto): Promise<Hotel> {
    // Fix date of update
    data.updatedAt = new Date();
    let updated: Hotel;
    try {
      updated = await this.hotelModel
        .findByIdAndUpdate(hotelId, data, { new: true })
        .exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: Hotel:update - can't do",
      );
    }
    return updated;
  }
}
