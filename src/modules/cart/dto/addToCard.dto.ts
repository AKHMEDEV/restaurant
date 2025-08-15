import { IsNotEmpty, IsUUID, IsInt, Min, isUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: '9b7a7c68-b59e-4a72-97b6-f85b9f4a5d9c' })
  @IsUUID()
  @IsNotEmpty()
  menuId: string;

  @ApiProperty({
    example: 0,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
