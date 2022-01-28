import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Formats route output data acc. to requirements

@Injectable()
export class SearchHotelRoomInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Hotel Room Data created by HotelRoomService
    return next.handle().pipe(
      map((value) =>
        value.map((room) => {
          return {
            id: room._id,
            title: room.title,
            description: room.description,
            images: room.images,
            hotel: {
              id: room.hotelId[0]._id,
              title: room.hotelId[0].title,
            },
          };
        }),
      ),
    );
  }
}
