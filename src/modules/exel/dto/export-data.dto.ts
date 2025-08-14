import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum ExportFormat {
  EXCEL = 'excel',
  CSV = 'csv',
  PDF = 'pdf',
}

export class ExportDataDto {
  @IsString()
  entityType: string;

  @IsOptional()
  @IsEnum(ExportFormat)
  format?: ExportFormat;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  filters?: string;
}
