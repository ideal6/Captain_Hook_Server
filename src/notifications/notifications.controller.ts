import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/common/user.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@User('username') username): Promise<Notification[]> {
    return this.notificationsService.findAll(username);
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<Notification> {
    return this.remove(id);
  }

  @Post()
  create(
    @User('username') username,
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.addNotification(
      username,
      createNotificationDto,
    );
  }
}
