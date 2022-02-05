import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { SupportEmployeeService } from '../support-employee.service';

// Formats route output data acc. to requirements

@Injectable()
export class SupportReqListManagerInterceptor implements NestInterceptor {
  constructor(
    private readonly supportEmployeeService: SupportEmployeeService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Support Request data created by Support Client Service
    return next.handle().pipe(
      switchMap((value) =>
        // Each request produces a promise, when we check, if it has unread messages
        // These promises we handle as Observables
        // To collect all them we use switchMap and forkJoin
        // This allows us to make these multi-await transform
        forkJoin(
          value.map(async (req) => {
            const messages = await this.supportEmployeeService.getUnreadCount(
              req._id,
            );
            const hasNewMessages = messages.length > 0;
            return {
              id: req._id.toString(),
              createdAt: req.createdAt,
              isActive: req.isActive,
              hasNewMessages,
              client: {
                id: req.user[0]['_id'],
                name: req.user[0]['name'],
                email: req.user[0]['email'],
                contactPhone: req.user[0]['contactPhone'],
              },
            };
          }),
        ),
      ),
    );
  }
}
