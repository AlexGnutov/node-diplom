import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class CreateUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats user created by admin
    return next.handle().pipe(
      map((value) => {
        return {
          id: value._id,
          email: value.email,
          name: value.name,
          contactPhone: value.contactPhone,
          role: value.role,
        };
      }),
    );
  }
}
