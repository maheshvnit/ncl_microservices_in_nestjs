// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { traceContext } from './common/middleware/trace-context';
import { IdempotencyService } from './common/idempotency.service';

@Controller()
export class AppController {

  constructor(private idem: IdempotencyService) {}

  @MessagePattern({ cmd: 'charge' })
  async charge(@Payload() data: any) {
    const { idempotencyKey, amount } = data;

    console.log("AppController-payment-service--charge-data", data);

    return this.idem.execute(
      `payment:${idempotencyKey}`,
      3600,
      async () => {
        // simulate charge
        return {
          status: 'SUCCESS',
          amount,
          chargedAt: new Date(),
        };
      },
    );
  }

  @MessagePattern({ cmd: 'get_payments' })
  getPayments() {
    console.log(
      'nest-ms-platform/payment-service-tcp AppController traceId:',
      traceContext.getStore()?.traceId,
    );

    return [
      { id: 1, name: 'Payment 1' },
      { id: 2, name: 'Payment 2' },
    ];
  }
}
