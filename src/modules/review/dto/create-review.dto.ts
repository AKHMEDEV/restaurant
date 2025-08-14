import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CommentTargetType } from 'generated/prisma';

export class CreateReviewDto {
  @ApiProperty({example: 'juda mazali va xizmat zor!',})
  @IsString()
  content: string;

  @ApiProperty()
  @IsUUID()
  targetId: string;

  @ApiProperty({
    example: CommentTargetType.RESTAURANT,
    enum: CommentTargetType,
  })
  @IsEnum(CommentTargetType)
  targetType: CommentTargetType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
