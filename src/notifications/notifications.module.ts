import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SmsService } from './dispatchers/sms.service';
import { SlackService } from './dispatchers/slack.service';
import { DiscordService } from './dispatchers/discord.service';
import { EmailService } from './dispatchers/email.service';
import { TelegramService } from './dispatchers/telegram.service';

@Module({
  providers: [
    NotificationsService,
    SmsService,
    SlackService,
    DiscordService,
    EmailService,
    TelegramService,
  ],
})
export class NotificationsModule {}
