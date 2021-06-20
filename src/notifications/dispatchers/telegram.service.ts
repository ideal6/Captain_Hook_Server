import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { Repository } from 'typeorm';
import {
  NotificationMethodType,
  NotificationMethod,
} from '../entities/notification-method.entity';

@Injectable()
export class TelegramService implements IDispatcher {
  private readonly telegramBot: TelegramBot;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(NotificationMethod)
    private readonly notificationMethodRepository: Repository<NotificationMethod>,
  ) {
    this.telegramBot = new TelegramBot(
      configService.get<string>('TELEGRAM_BOT_TOKEN'),
      { polling: true },
    );
    this.telegramBot.onText(/\/subscribe (.+)/, (...arg) =>
      this.subscribe(...arg).then(),
    );
    this.telegramBot.onText(/\/unsubscribe (.+)/, (...arg) =>
      this.unsubscribe(...arg).then(),
    );
  }

  async getNotificationMethodByNotificationId(
    id: number,
  ): Promise<NotificationMethod | undefined> {
    return this.notificationMethodRepository.findOne({
      notificationId: id,
      type: NotificationMethodType.TELEGRAM,
    });
  }

  async subscribe(msg: TelegramBot.Message, match: RegExpExecArray) {
    const notificationMethod: NotificationMethod = await this.getNotificationMethodByNotificationId(
      +match[1],
    );
    notificationMethod.subscribers = [
      ...new Set([...notificationMethod.subscribers, msg.chat.id.toString()]),
    ];
    await this.notificationMethodRepository.save(notificationMethod);
  }

  async unsubscribe(msg: TelegramBot.Message, match: RegExpExecArray) {
    const notificationMethod: NotificationMethod = await this.getNotificationMethodByNotificationId(
      +match[1],
    );
    notificationMethod.subscribers = [
      ...new Set([
        ...notificationMethod.subscribers.filter(
          (chatId) => chatId !== msg.chat.id.toString(),
        ),
      ]),
    ];
    await this.notificationMethodRepository.save(notificationMethod);
  }

  dispatch() {
    throw new Error('Method not implemented.');
  }
}
