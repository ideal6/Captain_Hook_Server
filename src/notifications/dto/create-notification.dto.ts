import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateNotificationMethodDto } from './create-notification-method.dto';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  condition: string;
  @IsArray()
  methods: CreateNotificationMethodDto[];
}
