import { Injectable } from '@nestjs/common';
import { ID } from '../common/ID';
import { HotelRoom, HotelRoomDocument } from './schema/hotel-room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchRoomsParams } from '../common/search-rooms-params';
import { HotelsService } from '../hotels/hotels.service';

interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    private hotelsService: HotelsService,
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  public async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    // Check, if hotel exist
    const checkHotel = await this.hotelsService.findById(data.hotelId);
    if (!checkHotel) {
      throw new Error();
    }
    // Combine data, if hotel exist
    const roomData = {
      ...data,
      createdAt: new Date(),
    };
    // Create Document
    const room = await this.hotelRoomModel.create(roomData);
    // Populate hotel data and return result
    return await room.populate({ path: 'hotelId' });
  }

  public async findById(id: ID): Promise<HotelRoom> {
    return await this.hotelRoomModel
      .findById(id)
      .populate({ path: 'hotelId' })
      .exec();
  }

  public async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    // Add result options
    const options = {
      limit: params.limit ? params.limit : null,
      skip: params.offset ? params.offset : null,
    };

    // Add filter by hotel ID - exact matching only
    let filter = {};
    if (params.isEnabled) {
      filter['isEnabled'] = true;
    }
    if (params.hotel) {
      filter['hotelId'] = params.hotel;
    }
    if (Object.keys(filter).length === 0) {
      filter = null;
    }

    // Return populated search results
    return await this.hotelRoomModel
      .find(filter, null, options)
      .populate({ path: 'hotelId' })
      .exec();
  }

  public async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    // Combine data for update
    const roomUpdateData = {
      ...data,
      updatedAt: new Date(),
    };
    // Return populated hotel room data
    return await this.hotelRoomModel
      .findOneAndUpdate({ id }, roomUpdateData, { new: true })
      .populate({ path: 'hotelId' })
      .exec();
  }
}
