import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackService implements IDispatcher {
  dispatch() {
    throw new Error('Method not implemented.');
  }
}
