import { NotificationMethodType } from '../entities/notification-method.entity';

export class CreateNotificationMethodDto {
  type: NotificationMethodType;
  name: string;
  key: string;
}
