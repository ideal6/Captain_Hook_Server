import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements IDispatcher {
  private readonly telegramBot: TelegramBot;
  constructor(private readonly configService: ConfigService) {
    this.telegramBot = new TelegramBot(
      configService.get<string>('TELEGRAM_BOT_TOKEN'),
      { polling: true },
    );
    this.telegramBot.onText(/\/subscribe (.+)/, (...arg) =>
      this.subscribe(...arg),
    );
    this.telegramBot.onText(/\/unsubscribe (.+)/, (...arg) =>
      this.unsubscribe(...arg),
    );
  }

  subscribe(msg: TelegramBot.Message, match: RegExpExecArray) {
    throw new Error('Method not implemented.');
  }

  unsubscribe(msg: TelegramBot.Message, match: RegExpExecArray) {
    throw new Error('Method not implemented.');
  }

  dispatch() {
    throw new Error('Method not implemented.');
  }
}
