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
export class SupportReqListManagerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Support Request data created by Support Client Service
    return next.handle().pipe(
      map((value) =>
        value.map((req) => {
          // console.log(req);
          return {
            id: req._id.toString(),
            createdAt: req.createdAt,
            isActive: req.isActive,
            hasNewMessages: 'unknown',
            client: {
              id: req.user[0]['_id'],
              name: req.user[0]['name'],
              email: req.user[0]['email'],
              contactPhone: req.user[0]['contactPhone'],
            },
          };
        }),
      ),
    );
  }
}
