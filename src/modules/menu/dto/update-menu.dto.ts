import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class UpdateMenuDto {
  @ApiProperty({ example: 'Cheeseburger' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Double cheeseburger with fries' })
  @IsOptional()
  @IsString()
  description?: string;
  
  @ApiProperty({ example: 18.5 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsUUID()
  restaurantId?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
