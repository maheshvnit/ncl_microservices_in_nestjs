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
import { MessagePattern } from '@nestjs/microservices';
import { traceContext } from './common/middleware/trace-context';

@Controller()
export class AppController {
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
