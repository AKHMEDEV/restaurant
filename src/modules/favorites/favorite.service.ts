import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async toggleFavorite(userId: string, menuId: string) {
    const menu = await this.prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('Menu not found');

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_menuId: { userId, menuId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { message: 'Removed from favorites', favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, menuId } });
    return { message: 'Added to favorites', favorited: true };
  }

  async getUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { menu: true },
    });
  }
}
