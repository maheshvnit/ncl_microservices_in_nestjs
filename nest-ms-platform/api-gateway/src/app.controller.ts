import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { traceContext } from './common/middleware/trace-context';

@Controller()
export class AppController {
  constructor(
    @Inject('USER') private user: ClientProxy,
    @Inject('ORDER') private order: ClientProxy,
    @Inject('PAYMENT') private payment: ClientProxy,
  ) {}

  @Get('/users')
  users() {
    const traceId = traceContext.getStore()?.traceId;
    return firstValueFrom(this.user.send({ cmd: 'get_users' }, {traceId}));
  }

  @Get('/orders')
  orders() {
    const traceId = traceContext.getStore()?.traceId;
    return firstValueFrom(this.order.send({ cmd: 'get_orders' }, {traceId}));
  }

  @Get('/payments')
  payments() {
    const traceId = traceContext.getStore()?.traceId;
    return firstValueFrom(this.payment.send({ cmd: 'get_payments' }, {traceId}));
  }
}
