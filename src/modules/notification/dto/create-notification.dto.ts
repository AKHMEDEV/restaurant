import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { NotificationType } from 'generated/prisma';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
