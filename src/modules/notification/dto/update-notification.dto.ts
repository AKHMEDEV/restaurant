import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { NotificationType } from 'generated/prisma';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
