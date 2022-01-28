import {Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors, UsePipes} from '@nestjs/common';
import { HotelRoomService } from '../hotel-room/hotel-room.service';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationValidationPipe } from './pipes/reservation-validation.pipe';
import { ReservationService } from './reservation.service';
import { CreateReservationInterceptor } from "./interceptors/create-reservation.interceptor";
import {filter} from "rxjs";
import {DatesValidationPipe} from "./pipes/dates-validation.pipe";
import {ID} from "../common/ID";
import {ReservationListInterceptor} from "./interceptors/reservation-list.interceptor";
import {Role} from "../roles/role.enum";
import {Roles} from "../roles/roles.decorator";

@Controller()
export class ReservationController {
  constructor(
    private readonly hotelRoomService: HotelRoomService,
    private readonly reservationService: ReservationService,
  ) {}

  @Post('api/client/reservations')
  @Roles(Role.User) // add roles restriction
  @UseInterceptors(CreateReservationInterceptor) // format output data
  @UsePipes(new ReservationValidationPipe()) // validate input data
  async createMyReservation(@Body() reservationData: ReservationDto) {
    reservationData.user = '61e82a837e3bab786f09dabe'; // будем брать из пользователя
    reservationData.hotel = '61e7f0bf62bc20dd768bf56a'; // будет ясно откуда брать после ответов
    return await this.reservationService.addReservation(reservationData);
  }
  // 401 - если пользователь не аутентифицирован, 403 - если роль пользователя не client, 400 - если номер с указанным ID не существует или отключен

  @Get('api/client/reservations')
  @Roles(Role.User) // add roles restriction
  @UseInterceptors(ReservationListInterceptor) // format output data
  myReservationsList() {
    const user = '61e82a837e3bab786f09dabe';
    const searchParams = { user };
    return this.reservationService.getReservations(searchParams);
  }
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не client

  @Delete('api/client/reservations/:id')
  @Roles(Role.User) // add roles restriction
  async deleteMyReservation(@Param('id') reservationId: ID) {
    return await this.reservationService.removeReservation(reservationId);
  }
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не client
  // 403 - если id текущего пользователя не совпадает с id пользователя в брони
  // 400 - если бронь с указанным ID не существует

  // MANAGER
  @Get('api/manager/reservations/:userId')
  @Roles(Role.Manager) // add roles restriction
  @UseInterceptors(ReservationListInterceptor)
  clientReservationsList(@Param('userId') user: ID) {
    const searchParams = { user };
    return this.reservationService.getReservations(searchParams);
  }
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не manager

  @Delete('api/manager/reservations/:userId/:reservationId')
  @Roles(Role.Manager) // add roles restriction
  async deleteClientReservation(
    @Param('userId') userId: ID,
    @Param('reservationId') reservationId: ID,
  ) {
    // ПРОВЕРИТЬ, что номер брони и номер пользователя соответствуют друг другу
    return await this.reservationService.removeReservation(reservationId);
  }
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не manager
  // 400 - если бронь с указанным ID для пользователя с указанным ID не существует
}
