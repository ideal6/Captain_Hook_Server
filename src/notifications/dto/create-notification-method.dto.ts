import { NotificaitonMethodType } from '../entities/notification-method.entity';

export class CreateNotificationMethodDto {
  type: NotificaitonMethodType;
  name: string;
  key: string;
}
