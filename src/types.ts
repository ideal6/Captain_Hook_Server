import { NotificationMethod } from './notifications/entities/notification-method.entity';

export interface IDispatcher {
  dispatch(notificationMethod: NotificationMethod);
}
