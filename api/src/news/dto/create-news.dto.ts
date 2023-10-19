import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNewsDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform((v) => (Array.isArray(v.value) ? v.value : [v.value]))
  categories?: string[];

  @IsString()
  @ApiProperty()
  subject: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  scheduled?: Date;

  @IsArray()
  @IsEmail(undefined, { each: true })
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform((v) => (Array.isArray(v.value) ? v.value : [v.value]))
  extraRecipients?: string[];

  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  files?: Array<Express.Multer.File>;
}
