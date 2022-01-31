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
export class GetMessagesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Formats Support Request data created by Support Client Service
    return next.handle().pipe(
      map((value) =>
        value.map((message) => {
          // console.log(message);
          return {
            id: message._id.toString(),
            createdAt: message.sentAt,
            text: message.text,
            readAt: message.readAt,
            author: {
              id: message.author[0]['_id'],
              name: message.author[0]['name'],
            },
          };
        }),
      ),
    );
  }
}
