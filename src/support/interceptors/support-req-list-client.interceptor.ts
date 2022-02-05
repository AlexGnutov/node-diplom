import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { SupportClientService } from '../support-client.service';

// Formats route output data acc. to requirements
@Injectable()
export class SupportReqListClientInterceptor implements NestInterceptor {
  constructor(private readonly supportClientService: SupportClientService) {}

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
            const messages = await this.supportClientService.getUnreadCount(
              req._id,
            );
            const hasNewMessages = messages.length > 0;
            return {
              id: req._id.toString(),
              createdAt: req.createdAt,
              isActive: req.isActive,
              hasNewMessages,
            };
          }),
        ),
      ),
    );
  }
}
