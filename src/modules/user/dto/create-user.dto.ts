import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'ali@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: UserRole.USER, enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  telegramChatId?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  googleId?: string  
}
