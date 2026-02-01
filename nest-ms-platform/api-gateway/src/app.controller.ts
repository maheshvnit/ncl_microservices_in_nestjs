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

import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('USER') private user: ClientProxy,
    @Inject('ORDER') private order: ClientProxy,
    @Inject('PAYMENT') private payment: ClientProxy,
  ) {}

  @Get('/users')
  users() {
    return firstValueFrom(this.user.send({ cmd: 'get_users' }, {}));
  }

  @Get('/orders')
  orders() {
    return firstValueFrom(this.order.send({ cmd: 'get_orders' }, {}));
  }

  @Get('/payments')
  payments() {
    return firstValueFrom(this.payment.send({ cmd: 'get_payments' }, {}));
  }
}
