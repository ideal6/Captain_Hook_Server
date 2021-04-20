import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService implements IDispatcher {
  dispatch() {
    throw new Error('Method not implemented.');
  }
}
