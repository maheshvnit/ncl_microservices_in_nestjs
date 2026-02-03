import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();

    let key = req.headers['idempotency-key'];

    if (!key) {
      key = uuid();
      req.headers['idempotency-key'] = key;
    }

    return next.handle();
  }
}
