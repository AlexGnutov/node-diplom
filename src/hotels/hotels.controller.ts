import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelsQueryParamsDto } from './dto/hotels-query-params.dto';
import { HotelDataInterceptor } from './interceptors/hotel-data.interceptor';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ParamDto } from '../common/pipes/param.dto';

// This controller and module contains only admins routes
// Other routes related to hotels and rooms are in the hotel-room module
@UseGuards(AuthenticatedGuard, RolesGuard)
@Roles(Role.Admin)
@Controller()
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  // 2.1.3 Add a new hotel
  @Post('api/admin/hotels')
  @UseInterceptors(HotelDataInterceptor)
  addHotel(@Body(new ValidationPipe()) hotelData: CreateHotelDto) {
    return this.hotelsService.create(hotelData);
  }

  // 2.1.4 Get hotels list
  @Get('api/admin/hotels')
  getHotelsList(
    @Query(new ValidationPipe()) hotelsQuery: HotelsQueryParamsDto,
  ) {
    return this.hotelsService.search(hotelsQuery);
  }

  // 2.1.5 Hotel description update
  @Put('api/admin/hotels/:hotelId')
  @UseInterceptors(HotelDataInterceptor)
  updateHotelDescription(
    @Param(new ValidationPipe()) param: ParamDto,
    @Body(new ValidationPipe()) hotelData: UpdateHotelDto,
  ) {
    return this.hotelsService.update(param.hotelId, hotelData);
  }
}
