import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class WaitConnectInterceptor implements NestInterceptor {
  constructor(@InjectConnection() private connection: Connection) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return from(
      this.connection.asPromise().then(
        (res) => {
          console.log('res', res);
          return;
        },
        (error) => {
          console.log('connect_error', error);
          return;
        },
      ),
    ).pipe(switchMap(next.handle));
  }
}
