import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { context, trace } from '@opentelemetry/api';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(
    req: Request & { traceId?: string },
    res: Response,
    next: NextFunction,
  ) {
    let traceId: string | undefined;

    // 1️⃣ Prefer incoming header
    traceId = req.headers['x-trace-id'] as string | undefined;

    // 2️⃣ Fall back to OpenTelemetry trace (if available)
    if (!traceId) {
      const span = trace.getSpan(context.active());
      traceId = span?.spanContext().traceId;
    }

    // 3️⃣ Final fallback
    if (!traceId) {
      traceId = randomUUID();
    }

    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);

    next();
  }
}
