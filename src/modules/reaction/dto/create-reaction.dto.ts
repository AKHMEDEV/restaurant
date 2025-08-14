import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentTargetType } from 'generated/prisma';

export class ToggleLikeDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Target ID (restaurant yoki menu ID)',
  })
  @IsNotEmpty()
  @IsString()
  targetId: string;

  @ApiProperty({
    example: 'RESTAURANT',
    description: 'Target turi (RESTAURANT yoki MENU_ITEM)',
    enum: CommentTargetType,
  })
  @IsNotEmpty()
  @IsEnum(CommentTargetType)
  targetType: CommentTargetType;
}
