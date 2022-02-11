import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ID } from '../common/ID';
import { HotelRoom } from './schema/hotel-room.interface';
import { Model } from 'mongoose';
import { SearchRoomsParams } from './dto/search-rooms-params';
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoomModelName } from '../common/constants';
import { Hotel } from '../hotels/schema/hotel.interface';

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
    @Inject(HotelRoomModelName)
    private hotelRoomModel: Model<HotelRoom>,
  ) {}

  public async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    // Check, if hotel exist
    let checkHotel: Hotel;
    try {
      checkHotel = await this.hotelsService.findById(data.hotelId);
    } catch (e) {
      throw new InternalServerErrorException(e, 'DB-error: HotelRoom Create');
    }
    // If Hotel doesn't exist - error
    if (!checkHotel) {
      throw new BadRequestException('Hotel doesnt exist');
    }
    // Combine data, if hotel exist
    const roomData = {
      ...data,
      createdAt: new Date(),
    };
    // Create Document
    let room: HotelRoom;
    try {
      room = await this.hotelRoomModel.create(roomData);
      // Populate hotel data and return result
      await room.populate({ path: 'hotelId' });
    } catch (e) {
      throw new InternalServerErrorException(e, 'DB-error: HotelRoom Create');
    }
    return room;
  }

  public async findById(id: ID): Promise<HotelRoom> {
    let room: HotelRoom;
    try {
      room = await this.hotelRoomModel
        .findById(id)
        .populate({ path: 'hotelId' })
        .exec();
    } catch (e) {
      throw new InternalServerErrorException(e, 'DB-error: HotelRoom findById');
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
    if (params.hotelId) {
      filter['hotelId'] = params.hotelId;
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
      throw new InternalServerErrorException(e, 'DB-error: HotelRoom search');
    }
    return rooms;
  }

  public async update(
    roomId: ID,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom> {
    // Add updated At
    const roomUpdateData = {
      ...data,
      updatedAt: new Date(),
    };
    // Return populated hotel room data
    let updated;
    try {
      updated = await this.hotelRoomModel
        .findByIdAndUpdate(roomId, roomUpdateData, { new: true })
        .populate({ path: 'hotelId' })
        .exec();
    } catch (e) {
      throw new InternalServerErrorException(e, 'DB-error: HotelRoom update');
    }
    return updated;
  }
}
