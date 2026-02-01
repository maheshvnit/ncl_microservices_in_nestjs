import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { TraceIdTcpInterceptor } from './common/middleware/trace-id-tcp.interceptor';
import { traceContext } from './common/middleware/trace-context';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: false, // 🔴 important for pure TCP
      customProps: () => {
        const store = traceContext.getStore();
        return store ? { traceId: store.traceId } : {};
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
