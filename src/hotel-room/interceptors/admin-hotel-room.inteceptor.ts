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
export class AdminHotelRoomInteceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Hotel Room Data created by HotelRoomService
    return next.handle().pipe(
      map((value) => {
        console.log(value);
        return {
          id: value._id,
          title: value.title,
          description: value.description,
          images: value.images,
          isEnabled: value.isEnabled,
          hotel: {
            id: value.hotelId[0]._id,
            title: value.hotelId[0].title,
            description: value.hotelId[0].description,
          },
        };
      }),
    );
  }
}
