import './tracing'; // MUST be first

import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new IdempotencyInterceptor(),
  );
  //await app.listen(process.env.PORT ?? 3100);
  await app.listen(process.env.PORT ?? 4100, '0.0.0.0');
}
bootstrap();
