import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Formats route output data acc. to requirements

@Injectable()
export class SupportReqListClientInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Support Request data created by Support Client Service
    return next.handle().pipe(
      map((value) =>
        value.map((req) => {
          return {
            id: req._id.toString(),
            createdAt: req.createdAt,
            isActive: req.isActive,
            hasNewMessages: 'unknown',
          };
        }),
      ),
    );
  }
}
