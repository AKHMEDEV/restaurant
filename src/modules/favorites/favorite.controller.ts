import {
  Controller,
  Get,
  Post,
  Req,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CheckAuthGuard } from 'src/guards';
import { Request } from 'express';

@UseGuards(CheckAuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // Foydalanuvchining barcha sevimlilarini olish
  @Get()
  async getUserFavorites(@Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.favoriteService.getUserFavorites(userId);
  }

  // Menuni sevimlilarga qo‘shish yoki olib tashlash
  @Post(':menuId')
  async toggleFavorite(@Req() req: Request, @Param('menuId') menuId: string) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.favoriteService.toggleFavorite(userId, menuId);
  }
}
