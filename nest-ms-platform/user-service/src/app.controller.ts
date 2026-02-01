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
  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    console.log(
      'nest-ms-platform/user-service-tcp AppController traceId:',
      traceContext.getStore()?.traceId,
    );

    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
  }
}

