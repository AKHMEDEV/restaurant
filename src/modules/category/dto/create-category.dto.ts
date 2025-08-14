import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Pizza' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Classic pizza with fresh tomatoes, mozzarella, and basil',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
