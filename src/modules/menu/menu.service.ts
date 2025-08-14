import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateMenuDto, UpdateMenuDto } from './dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const menus = await this.prisma.menu.findMany({
      include: { comments: true },
    });

    await Promise.all(
      menus.map((menu) =>
        this.prisma.menu.update({
          where: { id: menu.id },
          data: { views: { increment: 1 } },
        }),
      ),
    );

    const menusWithIncrementedViews = menus.map((menu) => ({
      ...menu,
      views: (menu.views || 0) + 1,
    }));

    return {
      message: 'success',
      count: menus.length,
      data: menusWithIncrementedViews,
    };
  }

  async findOne(id: string) {
    await this.prisma.menu.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!menu) throw new NotFoundException('Menu not found');

    return {
      message: 'success',
      data: {
        ...menu,
        views: (menu.views || 0) + 1,
      },
    };
  }

  async create(payload: CreateMenuDto) {
    const existing = await this.prisma.menu.findUnique({
      where: { name: payload.name },
    });

    if (existing)
      throw new BadRequestException('Menu already exists, try another name');

    const menu = await this.prisma.menu.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        image: payload.image,
        isAvailable: payload.isAvailable,
        restaurantId: payload.restaurantId,
        categoryId: payload.categoryId,
      },
    });

    return {
      message: 'success',
      data: menu,
    };
  }

  async update(id: string, payload: UpdateMenuDto) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });

    if (!menu) throw new NotFoundException('Menu not found');

    if (payload.name && payload.name !== menu.name) {
      const existing = await this.prisma.menu.findUnique({
        where: { name: payload.name },
      });

      if (existing) throw new BadRequestException('Menu name already taken');
    }

    const updatedMenu = await this.prisma.menu.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        image: payload.image,
        isAvailable: payload.isAvailable,
        restaurantId: payload.restaurantId,
        categoryId: payload.categoryId,
      },
    });

    return {
      message: 'updated',
      data: updatedMenu,
    };
  }

  async delete(id: string) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });

    if (!menu) throw new NotFoundException('Menu not found');

    await this.prisma.menu.delete({ where: { id } });

    return {
      message: 'deleted',
      data: null,
    };
  }
}
