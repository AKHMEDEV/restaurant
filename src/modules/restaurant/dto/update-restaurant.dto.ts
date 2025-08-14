import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsLatitude,
  IsLongitude,
  IsNumber,
} from 'class-validator';

export class UpdateRestaurantDto {
  @ApiProperty({ example: 'Sushi House', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Yapon taomlari boyicha eng yaxshi restoran',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    example: 'Toshkent, Chilonzor',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '09:00', required: false })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiProperty({ example: '22:00', required: false })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty({ example: 41.2995, required: false })
  @IsOptional()
  @IsLatitude()
  locationLatitude?: number;

  @ApiProperty({ example: 69.2401, required: false })
  @IsOptional()
  @IsLongitude()
  locationLongitude?: number;
}
