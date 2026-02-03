import { Controller, Get, Post, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { ResilientClient } from './common/resilience/resilient-client';

@Controller()
export class AppController {
  private user: ResilientClient;
  private order: ResilientClient;
  private payment: ResilientClient;

  constructor(
    @Inject('USER') userClient: ClientProxy,
    @Inject('ORDER') orderClient: ClientProxy,
    @Inject('PAYMENT') paymentClient: ClientProxy,
  ) {
    this.user = new ResilientClient(userClient, 'user-service', {
      timeoutMs: 3000,
      retries: 2,
      breaker: {
        errorThresholdPercentage: 40,
        resetTimeout: 15_000,
      },
    });

    this.order = new ResilientClient(orderClient, 'order-service', {
      timeoutMs: 3000,
      retries: 1,
      breaker: {
        errorThresholdPercentage: 50,
        resetTimeout: 20_000,
      },
    });

    this.payment = new ResilientClient(paymentClient, 'payment-service', {
      timeoutMs: 5000,
      retries: 0, // ❗ usually correct for payments
      breaker: {
        errorThresholdPercentage: 30,
        resetTimeout: 30_000,
      },
    });
  }

  @Get('/users')
  users() {
    return this.user.send({ cmd: 'get_users' }, {});
  }

  @Get('/orders')
  orders() {
    return this.order.send({ cmd: 'get_orders' }, {});
  }

  @Get('/payments')
  payments() {
    return this.payment.send({ cmd: 'get_payments' }, {});
  }

  @Post('/pay')
  //async charge(@Req() req: Request) {
  charge(@Req() req: Request) {
    //return this.payment.send({ cmd: 'charge' }, {});

    return this.payment.send(
        { cmd: 'charge' },
        {
          amount: 100,
          idempotencyKey: req.headers['idempotency-key'],
        },
      );
  }
}
