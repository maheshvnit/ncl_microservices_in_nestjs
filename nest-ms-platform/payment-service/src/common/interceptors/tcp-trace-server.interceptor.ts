import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { traceContext } from '../middleware/trace-context';

@Injectable()
export class TcpTraceServerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    // 🔹 Extract TCP payload
    const rpcData = context.switchToRpc().getData();

    // 🔹 Extract traceId injected by API Gateway
    const traceId: string | undefined = rpcData?.__trace?.traceId;

    // 🔹 If no traceId, continue normally
    if (!traceId) {
      return next.handle();
    }

    // 🔹 Bind traceId to AsyncLocalStorage
    return new Observable((subscriber) => {
      traceContext.run({ traceId }, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
