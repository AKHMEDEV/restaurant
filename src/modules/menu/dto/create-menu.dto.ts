import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Cheeseburger' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Double cheeseburger with fries' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 18.5 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  images?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ example:''})
  @IsUUID()
  restaurantId: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
