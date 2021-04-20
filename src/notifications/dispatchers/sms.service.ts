import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService implements IDispatcher {
  dispatch() {
    throw new Error('Method not implemented.');
  }
}
