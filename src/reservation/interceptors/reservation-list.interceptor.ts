import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Formats route output data acc. to requirements
// ror a new created reservation

@Injectable()
export class ReservationListInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Reservation Data created by ReservationsService
    return next.handle().pipe(
      map((reservations) =>
        reservations.map((reservation) => {
          return {
            id: reservation._id,
            startDate: reservation.dateStart.toISOString(),
            endDate: reservation.dateEnd.toISOString(),
            hotelRoom: {
              title: reservation.roomId[0].title,
              description: reservation.roomId[0].description,
              images: reservation.roomId[0].title,
            },
            hotel: {
              title: reservation.hotelId[0].title,
              description: reservation.hotelId[0].description,
            },
          };
        }),
      ),
    );
  }
}
