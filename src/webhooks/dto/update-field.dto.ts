import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateFieldDto } from './create-field.dto';

export class UpdateFieldDto extends CreateFieldDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
