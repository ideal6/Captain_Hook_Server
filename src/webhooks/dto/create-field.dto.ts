import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  description: string;
  @IsString()
  field: string;
}
