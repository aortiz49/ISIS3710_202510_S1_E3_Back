import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from '../../errors/business-errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        if (error.type === BusinessError.NOT_FOUND)
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        else if (error.type === BusinessError.PRECONDITION_FAILED)
          throw new HttpException(
            error.message,
            HttpStatus.PRECONDITION_FAILED,
          );
        else if (error.type === BusinessError.BAD_REQUEST)
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

        // ✅ Let Nest handle all other exceptions (like validation errors)
        throw error;
      }),
    );
  }
}
