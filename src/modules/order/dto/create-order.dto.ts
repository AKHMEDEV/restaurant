// src/orders/dto/create-order.dto.ts
import {
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsUUID()
  menuId: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  restaurantId: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
    example: [{ menuId: '', quantity: 1 }],
  })
  @IsArray()
  @ArrayNotEmpty()
  items: CreateOrderItemDto[];

  @ApiProperty({ example: '123 Main St, Tashkent, Uzbekistan' })
  @IsString()
  deliveryAddress: string;

  @ApiPropertyOptional({ example: 'DELIVERY', enum: ['DELIVERY', 'PICKUP'] })
  @IsOptional()
  deliveryMethod?: 'DELIVERY' | 'PICKUP';
}
