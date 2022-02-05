import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    let checkHotel;
    try {
      checkHotel = await this.hotelsService.findById(data.hotelId);
    } catch (e) {
      console.log('DB-error: HotelRoom Create', e.message);
      throw new InternalServerErrorException();
    }
    // If Hotel doesn't exist - error
    if (!checkHotel) {
      throw new Error('Hotel doesnt exist - remember your last night?');
    }
    // Combine data, if hotel exist
    const roomData = {
      ...data,
      createdAt: new Date(),
    };
    // Create Document
    let room;
    try {
      room = await this.hotelRoomModel.create(roomData);
      // Populate hotel data and return result
      await room.populate({ path: 'hotelId' });
    } catch (e) {
      console.log('DB-error: HotelRoom Create', e.message);
      throw new InternalServerErrorException();
    }
    return room;
  }

  public async findById(id: ID): Promise<HotelRoom> {
    let room;
    try {
      room = await this.hotelRoomModel
        .findById(id)
        .populate({ path: 'hotelId' })
        .exec();
    } catch (e) {
      console.log('DB-error: HotelRoom findById', e.message);
      throw new InternalServerErrorException();
    }
    return room;
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
    let rooms;
    try {
      rooms = await this.hotelRoomModel
        .find(filter, null, options)
        .populate({ path: 'hotelId' })
        .exec();
    } catch (e) {
      console.log('DB-error: HotelRoom search', e.message);
      throw new InternalServerErrorException();
    }
    return rooms;
  }

  public async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    // Combine data for update
    const roomUpdateData = {
      ...data,
      updatedAt: new Date(),
    };
    // Return populated hotel room data
    let updated;
    try {
      updated = await this.hotelRoomModel
        .findOneAndUpdate({ id }, roomUpdateData, { new: true })
        .populate({ path: 'hotelId' })
        .exec();
    } catch (e) {
      console.log('DB-error: HotelRoom update', e.message);
      throw new InternalServerErrorException();
    }
    return updated;
  }
}
