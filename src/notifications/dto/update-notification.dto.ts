import { OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateNotificationMethodDto } from './create-notification-method.dto';
import { CreateNotificationDto } from './create-notification.dto';
import { UpdateNotificationMethodDto } from './update-notification-method.dto';

export class UpdateNotificationDto extends OmitType(
  PartialType(CreateNotificationDto),
  ['methods'] as const,
) {
  @IsArray()
  methods: UpdateNotificationMethodDto[];
}
