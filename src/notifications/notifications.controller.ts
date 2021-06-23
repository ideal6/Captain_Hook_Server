import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '../common/user.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { JwtAuthGuard } from '../common/jwt-auth.gurad';

@UseGuards(JwtAuthGuard)
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
  remove(
    @User('username') username,
    @Param('id') id: number,
  ): Promise<Notification> {
    return this.notificationsService.remove(username, id);
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
