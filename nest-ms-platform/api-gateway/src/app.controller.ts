import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TraceClientProxy } from './common/trace/trace-client.proxy';

@Controller()
export class AppController {
  private user: TraceClientProxy;
  private order: TraceClientProxy;
  private payment: TraceClientProxy;

  constructor(
    @Inject('USER') userClient: ClientProxy,
    @Inject('ORDER') orderClient: ClientProxy,
    @Inject('PAYMENT') paymentClient: ClientProxy,
  ) {
    this.user = new TraceClientProxy(userClient);
    this.order = new TraceClientProxy(orderClient);
    this.payment = new TraceClientProxy(paymentClient);
  }

  @Get('/users')
  users() {
    return firstValueFrom(
      this.user.send({ cmd: 'get_users' }, {}),
    );
  }

  @Get('/orders')
  orders() {
    return firstValueFrom(
      this.order.send({ cmd: 'get_orders' }, {}),
    );
  }

  @Get('/payments')
  payments() {
    return firstValueFrom(
      this.payment.send({ cmd: 'get_payments' }, {}),
    );
  }
}
