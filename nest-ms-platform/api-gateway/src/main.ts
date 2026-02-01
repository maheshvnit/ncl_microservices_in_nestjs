import './tracing'; // MUST be first

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //await app.listen(process.env.PORT ?? 3100);
  await app.listen(process.env.PORT ?? 4100, '0.0.0.0');
}
bootstrap();
