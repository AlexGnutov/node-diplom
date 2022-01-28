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
export class CreateReservationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Hotel Room Data created by HotelRoomService
    return next.handle().pipe(
      map((reservation) => {
        console.log(reservation);
        return {
          startDate: reservation.dateStart.toISOString(),
          endDate: reservation.dateEnd.toISOString(),
          hotelRoom: {
            title: reservation.roomId[0].title,
            description: reservation.roomId[0].description,
            images: reservation.roomId[0].images,
          },
          hotel: {
            title: reservation.hotelId[0].title,
            description: reservation.hotelId[0].description,
          },
        };
      }),
    );
  }
}
