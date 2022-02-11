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
import { ReservationService } from './reservation.service';
import { CreateReservationInterceptor } from './interceptors/create-reservation.interceptor';
import { ReservationListInterceptor } from './interceptors/reservation-list.interceptor';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RolesGuard } from '../roles/roles.guard';
import { RequestUserInterface } from '../common/request-user-interface';
import { ReservationSearchOptionsDto } from './dto/reservation-search-options.dto';
import { Reservation } from './schema/reservation.interface';
import { ParamDto } from '../common/pipes/param.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { DatesValidationPipe } from '../common/pipes/dates.validation.pipe';

@Controller()
export class ReservationController {
  constructor(
    private readonly hotelRoomService: HotelRoomService,
    private readonly reservationService: ReservationService,
  ) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('api/client/reservations')
  @Roles(Role.User) // add roles restriction
  @UsePipes(new DatesValidationPipe())
  @UseInterceptors(CreateReservationInterceptor) // format output data
  async createMyReservation(
    @Body(new ValidationPipe())
    data: ReservationDto,
    @Request() req: RequestUserInterface,
  ) {
    // Add user id from req(session)
    data.userId = req.user.id;
    // Check if room and hotel exist together
    const roomExist = await this.hotelRoomService.findById(data.roomId);
    if (!roomExist) {
      throw new BadRequestException("Room doesn't exist");
    }
    data.hotelId = roomExist.hotelId;
    // Try to add reservation:
    return await this.reservationService.addReservation(data);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/client/reservations')
  @Roles(Role.User) // add roles restriction
  @UseInterceptors(ReservationListInterceptor) // format output data
  myReservationsList(@Request() req: RequestUserInterface) {
    const data: ReservationSearchOptionsDto = {
      userId: req.user.id,
    };
    return this.reservationService.getReservations(data);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete('api/client/reservations/:reservationId')
  @Roles(Role.User) // add roles restriction
  async deleteMyReservation(
    @Param(new ValidationPipe()) param: ParamDto,
    @Request() req: RequestUserInterface,
  ) {
    const reservation = await this.reservationService.findById(
      param.reservationId,
    );
    if (!reservation) {
      throw new BadRequestException("Reservation doesn't exist");
    }
    // Compare user and reservation user
    if (reservation.userId.toString() !== req.user.id) {
      throw new ForbiddenException();
    }
    return this.reservationService.removeReservation(param.reservationId);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('api/manager/reservations/:userId')
  @Roles(Role.Manager) // add roles restriction
  @UseInterceptors(ReservationListInterceptor)
  clientReservationsList(@Param('userId') data: ReservationSearchOptionsDto) {
    return this.reservationService.getReservations(data);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete('api/manager/reservations/:userId/:reservationId')
  @Roles(Role.Manager) // add roles restriction
  async deleteClientReservation(@Param(new ValidationPipe()) param: ParamDto) {
    const reservation: Reservation | null =
      await this.reservationService.findById(param.reservationId);
    if (!reservation) {
      throw new BadRequestException("Reservation doesn't exist");
    }
    // Compare user and reservation user
    if (reservation.userId.toString() !== param.userId) {
      throw new ForbiddenException();
    }
    return this.reservationService.removeReservation(param.reservationId);
  }
}
