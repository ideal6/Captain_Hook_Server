import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordService implements IDispatcher {
  dispatch() {
    throw new Error('Method not implemented.');
  }
}
