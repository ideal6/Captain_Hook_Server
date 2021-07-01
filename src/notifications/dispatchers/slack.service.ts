import { Injectable } from '@nestjs/common';
import { IDispatcher } from '../../types';

@Injectable()
export class SlackService implements IDispatcher {
  dispatch() {
    throw new Error('Method not implemented.');
  }

  async subscribe() {}

  async unsubscribe() {}
}
