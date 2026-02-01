import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { traceContext } from '../middleware/trace-context';

export class TraceClientProxy {
  constructor(private readonly client: ClientProxy) {}

  send<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Observable<TResult> {
    const traceId = traceContext.getStore()?.traceId;

    return this.client.send(pattern, {
      ...data,
      __trace: { traceId },
    });
  }

  emit<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Observable<TResult> {
    const traceId = traceContext.getStore()?.traceId;

    return this.client.emit(pattern, {
      ...data,
      __trace: { traceId },
    });
  }
}
