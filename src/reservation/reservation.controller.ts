import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { HotelRoomService } from '../hotel-room/hotel-room.service';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationValidationPipe } from './pipes/reservation-validation.pipe';
import { ReservationService } from './reservation.service';
import { CreateReservationInterceptor } from './interceptors/create-reservation.interceptor';
import { ID } from '../common/ID';
import { ReservationListInterceptor } from './interceptors/reservation-list.interceptor';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RolesGuard } from '../roles/roles.guard';

@Controller()
export class ReservationController {
  constructor(
    private readonly hotelRoomService: HotelRoomService,
    private readonly reservationService: ReservationService,
  ) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('api/client/reservations')
  @Roles(Role.User) // add roles restriction
  @UseInterceptors(CreateReservationInterceptor) // format output data
  @UsePipes(new ReservationValidationPipe()) // validate input data
  async createMyReservation(@Body() data: ReservationDto, @Request() req: any) {
    // Add user id from req(session)
    data.user = req.user.id;
    // Check if room and hotel exist together
    const roomExist = await this.hotelRoomService.findById(data.room);
    console.log(roomExist, roomExist.hotelId[0]['_id'].toString());
    if (!roomExist || roomExist.hotelId[0]['_id'].toString() !== data.hotel) {
      console.log('room not exist');
      throw new BadRequestException();
    }
    // Try to add reservation:
    return await this.reservationService.addReservation(data);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/client/reservations')
  @Roles(Role.User) // add roles restriction
  @UseInterceptors(ReservationListInterceptor) // format output data
  myReservationsList(@Request() req: any) {
    const user = req.user.id;
    const searchParams = { user };
    return this.reservationService.getReservations(searchParams);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete('api/client/reservations/:id')
  @Roles(Role.User) // add roles restriction
  async deleteMyReservation(
    @Param('id') reservationId: ID,
    @Request() req: any,
  ) {
    const reservation = await this.reservationService.getReservations({
      id: reservationId,
    });
    console.log(reservation);
    if (!reservation[0]) {
      throw new BadRequestException();
    }
    // Compare user and reservation user
    const userId = req.user.id;
    if (reservation[0].userId.toString() !== userId) {
      throw new ForbiddenException();
    }
    return this.reservationService.removeReservation(reservationId);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/manager/reservations/:userId')
  @Roles(Role.Manager) // add roles restriction
  @UseInterceptors(ReservationListInterceptor)
  clientReservationsList(@Param('userId') user: ID) {
    const searchParams = { user };
    return this.reservationService.getReservations(searchParams);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete('api/manager/reservations/:userId/:reservationId')
  @Roles(Role.Manager) // add roles restriction
  deleteClientReservation(
    @Param('userId') userId: ID,
    @Param('reservationId') reservationId: ID,
  ) {
    const reservation = this.reservationService.getReservations({
      id: reservationId,
    });
    if (!reservation[0]) {
      throw new BadRequestException();
    }
    // Compare user and reservation user
    if (reservation[0].userId.toString() !== userId) {
      throw new BadRequestException();
    }
    return this.reservationService.removeReservation(reservationId);
  }
}
