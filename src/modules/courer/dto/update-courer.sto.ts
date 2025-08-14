import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from './create-courer.dto';

export class UpdateCourierDto {
  @ApiPropertyOptional({ example: 'Ali Valiyev' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: VehicleType.BICYCLE,
    enum: VehicleType,
  })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicle?: VehicleType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
