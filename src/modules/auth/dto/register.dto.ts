import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'aljon' })
  @IsString()
  @IsNotEmpty()
  @Length(3)
  fullName: string;

  @ApiProperty({ example: 'aljon@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'aljon123' })
  @IsString()
  @IsNotEmpty()
  @Length(4)
  password: string;

  @ApiProperty({ example: '+998333053334' })
  @Matches(/^\+\d{7,15}$/, {
    message:
      'Telefon raqam xalqaro formatda bolishi kerak. Masalan: +998901234567 yoki +79123456789 , ...',
  })
  phone: string;
}
