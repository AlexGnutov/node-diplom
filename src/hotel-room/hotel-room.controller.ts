import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put, Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Request, UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from '../common/utils/image-file-filter.util';
import { editFileName } from '../common/utils/edit-file-name.util';
import { HotelRoomService } from './hotel-room.service';
import { AdminHotelRoomInteceptor } from './interceptors/admin-hotel-room.inteceptor';
import { ID } from '../common/ID';
import { SearchRoomsParams } from "../common/search-rooms-params";
import {SearchHotelRoomInterceptor} from "./interceptors/search-hotel-room.interceptor";
import {ExactHotelRoomInterceptor} from "./interceptors/exact-hotel-room.interceptor";
import {Role} from "../roles/role.enum";
import {Roles} from "../roles/roles.decorator";
import {AuthenticatedGuard} from "../auth/guards/authenticated.guard";
import {RolesGuard} from "../roles/roles.guard";

@Controller()
export class HotelRoomController {
  constructor(private readonly hotelRoomService: HotelRoomService) {}

  @Get('api/common/hotel-rooms')
  @UseInterceptors(SearchHotelRoomInterceptor)
  hotelRoomsSearch(
    @Query() queryParams: SearchRoomsParams,
    @Request() req: any,
  ) {
    if (!req.user || req.user['role'] === 'client') {
      queryParams.isEnabled = true;
    }
    return this.hotelRoomService.search(queryParams);
  }

  @Get('api/common/hotel-rooms/:id')
  @UseInterceptors(ExactHotelRoomInterceptor)
  hotelRoomInformation(@Param('id') id: ID) {
    return this.hotelRoomService.findById(id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('/api/admin/hotel-rooms/')
  @Roles(Role.Admin) // restrict roles
  @UseInterceptors(
    FilesInterceptor('image', 3, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
    AdminHotelRoomInteceptor,
  )
  addHotelRoom(@UploadedFiles() files, @Body() dataFields) {
    const images = [];
    files.forEach((file) => images.push(file.filename));
    const roomData = {
      ...dataFields,
      images,
    };
    return this.hotelRoomService.create(roomData);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put('api/admin/hotel-rooms/:id')
  @Roles(Role.Admin) // restrict roles
  @UseInterceptors(
    FilesInterceptor('image', 3, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
    AdminHotelRoomInteceptor,
  )
  updateHotelRoom(
    @UploadedFiles() files,
    @Body() dataFields,
    @Param('id') id: ID,
  ) {
    // Put file names into array
    const newImages: string[] = [];
    files.forEach((file) => newImages.push(file.filename));
    // Check if old images were sent as JSON string
    if (dataFields.images) {
      try {
        const oldImages: string[] = JSON.parse(dataFields.images);
        dataFields.images = oldImages.concat(newImages);
      } catch (e) {
        console.log(e.message);
      }
    } else {
      // If no old images data was sent - just take file names
      dataFields.images = newImages;
    }
    // console.log(dataFields.images);
    const roomData = { ...dataFields };
    return this.hotelRoomService.update(id, roomData);
  }
}
