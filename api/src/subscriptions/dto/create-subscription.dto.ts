import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(0, 120)
  @IsOptional()
  @ApiProperty()
  @Transform((v) => (v.value === '' ? undefined : v.value))
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty()
  categories: string[];
}
