import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'generated/prisma';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'DELIVERED', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
