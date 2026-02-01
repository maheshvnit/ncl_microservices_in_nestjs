import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { TraceIdTcpInterceptor } from './common/middleware/trace-id-tcp.interceptor';
import { traceContext } from './common/middleware/trace-context';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',

        // Prevent HTTP request/response noise in TCP services
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },

        formatters: {
          log(object) {
            const store = traceContext.getStore();
            return {
              ...object,
              traceId: store?.traceId,
            };
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdTcpInterceptor,
    },
  ],
})
export class AppModule {}
