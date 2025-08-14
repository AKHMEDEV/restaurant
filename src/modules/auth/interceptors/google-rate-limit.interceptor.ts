import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GoogleRateLimitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException && error.getStatus() === 429) {
          return throwError(
            () =>
              new HttpException(
                {
                  message: error.message,
                  statusCode: HttpStatus.TOO_MANY_REQUESTS,
                  error: 'Google OAuth Rate Limit Exceeded',
                  retryAfter: 1800,
                },
                HttpStatus.TOO_MANY_REQUESTS,
              ),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
