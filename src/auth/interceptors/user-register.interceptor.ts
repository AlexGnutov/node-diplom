import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserRegisterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats user created by admin
    return next.handle().pipe(
      map((value) => {
        return {
          id: value._id,
          email: value.email,
          name: value.name,
        };
      }),
    );
  }
}