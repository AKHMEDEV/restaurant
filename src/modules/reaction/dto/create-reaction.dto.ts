import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentTargetType } from 'generated/prisma';

export class ToggleLikeDto {
  @ApiProperty({})
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
