import { IsNotEmpty, IsUUID } from 'class-validator';

export class ToggleFavoriteDto {
  @IsUUID()
  @IsNotEmpty()
  menuId: string;
}
