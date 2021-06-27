import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateNotificationMethodDto } from './create-notification-method.dto';

export class UpdateNotificationMethodDto extends PartialType(
  CreateNotificationMethodDto,
) {
  @IsNumber()
  id?: number;
}
