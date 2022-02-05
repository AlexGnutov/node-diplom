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
export class HotelDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats hotel created by HotelService
    return next.handle().pipe(
      map((value) => {
        return {
          id: value._id,
          title: value.title,
          description: value.description,
        };
      }),
    );
  }
}
