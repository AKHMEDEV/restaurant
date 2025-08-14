import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'jorj madrimov' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'jorj@gmail.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'MyStrongPassword123' })
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
