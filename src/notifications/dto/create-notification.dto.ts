import { CreateNotificationMethodDto } from './create-notification-method.dto';

export class CreateNotificationDto {
  condition: string;
  methods: CreateNotificationMethodDto[];
}
