// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER',
        transport: Transport.TCP,
        options: { host: 'user-service', port: 4101 },
      },
      {
        name: 'ORDER',
        transport: Transport.TCP,
        options: { host: 'order-service', port: 4102 },
      },
      {
        name: 'PAYMENT',
        transport: Transport.TCP,
        options: { host: 'payment-service', port: 4103 },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
