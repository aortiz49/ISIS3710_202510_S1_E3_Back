import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        if (error instanceof BusinessLogicException) {
          if (error.type === BusinessError.BAD_REQUEST) {
            // Return a 400 status code with the error message
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          }
          if (error.type === BusinessError.NOT_FOUND) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
          }
          if (error.type === BusinessError.PRECONDITION_FAILED) {
            throw new HttpException(
              error.message,
              HttpStatus.PRECONDITION_FAILED,
            );
          }
        }

        // Let Nest handle other exceptions (like validation errors)
        throw error;
      }),
    );
  }
}
