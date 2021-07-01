import { Injectable, OnModuleInit } from '@nestjs/common';
import { IDispatcher } from '../../types';
import { NotificationMethod } from '../entities/notification-method.entity';
import * as https from 'https';
import * as qs from 'querystring';

@Injectable()
export class SmsService implements IDispatcher {
  dispatch(notificationMethod: NotificationMethod) {
    throw new Error('Method not implemented.');
  }
}
