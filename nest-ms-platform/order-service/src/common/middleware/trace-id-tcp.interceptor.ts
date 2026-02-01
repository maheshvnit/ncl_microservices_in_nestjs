import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { context, trace } from '@opentelemetry/api';
import { randomUUID } from 'crypto';
import { traceContext } from './trace-context';

@Injectable()
export class TraceIdTcpInterceptor implements NestInterceptor {
  private tracer = trace.getTracer('nestjs-tcp');

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const data = ctx.switchToRpc().getData();
    const headers = data?.headers ?? {};

    const incomingTraceId = headers['x-trace-id'];

    // 🔹 Create a real server span for TCP
    const span = this.tracer.startSpan('tcp.request', {
      attributes: {
        'messaging.system': 'nestjs-tcp',
        'service.name': 'order-service',
      },
    });

    const traceId =
      incomingTraceId ??
      span.spanContext().traceId ??
      randomUUID();

    data.traceId = traceId;
    console.log(
      'nest-ms-platform/order-service-tcp traceId:',
      traceId,
    );

    // 🔹 Bind traceId to AsyncLocalStorage
    return traceContext.run({ traceId }, () =>
      next.handle().pipe(
        finalize(() => {
          span.end();
        }),
      ),
    );
  }
}
