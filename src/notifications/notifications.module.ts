import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SmsService } from './dispatchers/sms.service';
import { SlackService } from './dispatchers/slack.service';
import { DiscordService } from './dispatchers/discord.service';
import { EmailService } from './dispatchers/email.service';
import { TelegramService } from './dispatchers/telegram.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationHistory } from './notification-history.entity';
import { Notification } from './notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationHistory])],
  providers: [
    NotificationsService,
    SmsService,
    SlackService,
    DiscordService,
    EmailService,
    TelegramService,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
