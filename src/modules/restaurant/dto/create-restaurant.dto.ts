import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Sushi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Yapon taomlari boyicha eng yaxshi restoran',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '09:00', required: false })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiProperty({ example: '22:00', required: false })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty({ example: 41.2995, description: 'Latitude of the restaurant' })
  @IsNotEmpty()
  @IsLatitude()
  locationLatitude: number;

  @ApiProperty({ example: 69.2401, description: 'Longitude of the restaurant' })
  @IsNotEmpty()
  @IsLongitude()
  locationLongitude: number;
}
