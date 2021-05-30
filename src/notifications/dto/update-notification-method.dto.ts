import { PartialType } from '@nestjs/swagger';
import { CreateNotificationMethodDto } from './create-notification-method.dto';

export class UpdateNotificationMethodDto extends PartialType(
  CreateNotificationMethodDto,
) {
  id: number;
}
