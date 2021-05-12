import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  @Get()
  getNotifications(): Promise<Notification[]> {
    return null;
  }

  @Get(':id')
  getNotification(@Param('id') id: string): Promise<Notification> {
    return null;
  }

  @Put()
  updateNotification(
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return null;
  }

  @Delete('/:id')
  deleteNotification(@Param('id') id: string): Promise<Notification> {
    return null;
  }

  @Post()
  createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return null;
  }
}
