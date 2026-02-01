// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { TraceIdMiddleware } from './common/middleware/trace-id.middleware';

@Module({
  imports: [
    PrometheusModule.register(),

    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',

        // 👇 inject traceId into every log
        // customProps: (req) => ({
        //   traceId: (req as any).traceId,
        // }),

        customProps: (req: any) => ({
          traceId: req.traceId,
        }),


        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}

