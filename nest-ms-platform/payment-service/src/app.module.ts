import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
//import { TraceIdTcpInterceptor } from './common/middleware/trace-id-tcp.interceptor';
import { TcpTraceServerInterceptor } from './common/interceptors/tcp-trace-server.interceptor';
import { traceContext } from './common/middleware/trace-context';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TcpTraceServerInterceptor,
    },
  ],
})
export class AppModule {}
