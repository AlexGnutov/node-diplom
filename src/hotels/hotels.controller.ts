import {
  Body,
  Controller, ExecutionContext,
  Get,
  Param,
  Post,
  Put,
  Query, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelsQueryParamsDto } from './dto/hotels-query-params.dto';
import { ID } from '../common/ID';
import { HotelDataInterceptor } from './interceptors/hotel-data.interceptor';
import {Roles, ROLES_KEY} from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { Reflector } from '@nestjs/core';
import {RolesGuard} from "../roles/roles.guard";

@Roles(Role.Admin)
@Controller()
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}
  // Для всех обработчиков этого контроллера требования по ошибкам:
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не admin

  @Post('api/admin/hotels')
  @UseInterceptors(HotelDataInterceptor)
  addHotel(@Body() hotelData: CreateHotelDto) {
    return this.hotelsService.create(hotelData);
  }

  @Get('api/admin/hotels')
  @UseGuards(RolesGuard)
  getHotelsList(@Query() hotelsQuery: HotelsQueryParamsDto) {
    return this.hotelsService.search(hotelsQuery);
  }

  @Put('api/admin/hotels/:id')
  @UseInterceptors(HotelDataInterceptor)
  updateHotelDescription(
    @Param('id') hotelId: ID,
    @Body() hotelData: CreateHotelDto,
  ) {
    return this.hotelsService.update(hotelId, hotelData);
  }
}
