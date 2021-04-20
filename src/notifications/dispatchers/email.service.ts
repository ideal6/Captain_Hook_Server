import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService implements IDispatcher {
  dispatch() {
    throw new Error('Method not implemented.');
  }
}
