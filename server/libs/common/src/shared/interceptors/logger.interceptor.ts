import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodKey = context.getHandler().name;
    const className = context.getClass().name;
    this.logger.log(`Before controller ${className}, method ${methodKey}...`);

    return next
      .handle()
      .pipe(
        tap((res) =>
          this.logger.log(
            `After controller ${className}, method ${methodKey}...`,
            res,
          ),
        ),
      );
  }
}
