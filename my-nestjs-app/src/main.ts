import './tracing'; // MUST be first

import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';

console.log('process.env.PORT:' + process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3003, '0.0.0.0');
}
bootstrap();
