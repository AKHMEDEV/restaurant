import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, menuId: string, quantity: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('Menu not found');

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_menuId: { userId, menuId } },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: { userId, menuId, quantity },
    });
  }

  async updateCartItem(userId: string, menuId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { userId_menuId: { userId, menuId } },
      data: { quantity },
    });
  }

  async removeFromCart(userId: string, menuId: string) {
    return this.prisma.cartItem.delete({
      where: { userId_menuId: { userId, menuId } },
    });
  }

  async getUserCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { menu: true },
    });
  }
}
