// src/common/resilience/resilient-client.ts

import CircuitBreaker from 'opossum';
import { ClientProxy, PatternMetadata } from '@nestjs/microservices';
import { firstValueFrom, retry, timeout } from 'rxjs';
import { traceContext } from '../middleware/trace-context';

export interface ResilienceOptions {
  timeoutMs?: number;
  retries?: number;
  breaker?: CircuitBreaker.Options;
}

type Payload = Record<string, any>;

export class ResilientClient {
  private readonly breaker: CircuitBreaker;

  constructor(
    private readonly client: ClientProxy,
    private readonly serviceName: string,
    options: ResilienceOptions = {},
  ) {
    this.breaker = new CircuitBreaker(
      async (pattern: PatternMetadata, payload: Payload) => {
        const trace = traceContext.getStore();

        return firstValueFrom(
          this.client
            .send(pattern, {
              ...payload,      // ✅ safe (object-only)
              __trace: trace,  // ✅ trace preserved
            })
            .pipe(
              timeout(options.timeoutMs ?? 3000),
              retry(options.retries ?? 2),
            ),
        );
      },
      {
        timeout: options.timeoutMs ?? 3000,
        errorThresholdPercentage: 50,
        resetTimeout: 10_000,
        rollingCountTimeout: 10_000,
        rollingCountBuckets: 10,
        ...options.breaker,
      },
    );

    this.registerEvents();
  }

  private registerEvents() {
    this.breaker.on('open', () =>
      console.error(`[CB OPEN] ${this.serviceName}`),
    );
    this.breaker.on('halfOpen', () =>
      console.warn(`[CB HALF-OPEN] ${this.serviceName}`),
    );
    this.breaker.on('close', () =>
      console.log(`[CB CLOSED] ${this.serviceName}`),
    );
  }

  async send<T = unknown>(
    pattern: PatternMetadata,
    payload: Payload = {},
  ): Promise<T> {
    return this.breaker.fire(pattern, payload);
  }
}
