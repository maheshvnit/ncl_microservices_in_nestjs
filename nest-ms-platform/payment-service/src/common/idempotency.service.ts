import { Injectable } from '@nestjs/common';
import { redis } from './redis';

@Injectable()
export class IdempotencyService {
  async execute<T>(
    key: string,
    ttlSeconds: number,
    fn: () => Promise<T>,
  ): Promise<T> {
    const cached = await redis.get(key);
    console.log("IdempotencyService-payment-service-cached", cached);
    if (cached) {
      return JSON.parse(cached);
    }
    console.log("IdempotencyService-payment-service-cached-hit-fail", cached);
    
    const result = await fn();
    
    await redis.set(
      key,
      JSON.stringify(result),
      'EX',
      ttlSeconds,
    );
    console.log("IdempotencyService-payment-service-result", result);
    return result;
  }
}
