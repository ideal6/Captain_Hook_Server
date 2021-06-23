import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationMethodType } from '../entities/notification-method.entity';

export class CreateNotificationMethodDto {
  @IsEnum(NotificationMethodType)
  type: NotificationMethodType;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  key: string;
}
