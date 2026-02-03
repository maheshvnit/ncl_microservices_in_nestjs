// idempotency.module.ts

import { Module } from '@nestjs/common';
import { IdempotencyService } from './common/idempotency.service';

@Module({
  providers: [IdempotencyService],
  exports: [IdempotencyService],
})
export class IdempotencyModule {}
