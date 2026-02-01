import { Injectable, NestMiddleware } from '@nestjs/common';
//import { randomUUID } from 'crypto';
import { randomBytes } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { context, trace } from '@opentelemetry/api';
import { traceContext } from './trace-context';

function generateTraceId(): string {
  return randomBytes(16).toString('hex'); // 32-char OTEL traceId
}

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request & { traceId?: string }, res: Response, next: NextFunction) {
    // let traceId =
    //   (req.headers['x-trace-id'] as string | undefined) ??
    //   trace.getSpan(context.active())?.spanContext().traceId ??
    //   randomUUID();

    const traceId =
      (req.headers['x-trace-id'] as string | undefined) ??
      trace.getSpan(context.active())?.spanContext().traceId ??
      generateTraceId();

    console.log("nest-ms-platform/api-gateway-request traceId:", traceId);

    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);

    // 🔑 bind to ALS
    traceContext.run({ traceId }, () => next());
  }
}
