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
export class CreateSupportRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Support Request data created by Support Client Service
    return next.handle().pipe(
      map((value) => {
        // console.log(value);
        return [
          {
            id: value._id.toString(),
            createdAt: value.createdAt,
            isActive: value.isActive,
            hasNewMessages: false,
          },
        ];
      }),
    );
  }
}
