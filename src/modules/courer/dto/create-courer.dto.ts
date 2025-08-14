import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum VehicleType {
  BICYCLE = 'Bicycle',
  MOTORBIKE = 'Motorbike',
  CAR = 'Car',
}

export class CreateCourierDto {
  @ApiProperty({ example: 'new nw' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'new@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+99890124567' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: VehicleType.BICYCLE,
    enum: VehicleType,
  })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicle?: VehicleType;
}
