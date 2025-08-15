import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        menus: {
          select: {
            name: true,
            price: true,
            isAvailable: true,
            restaurant: {
              select: {
                name: true,
                openTime: true,
                closeTime: true,
              },
            },
          },
        },
      },
    });

    return {
      message: 'success',
      count: categories.length,
      data: categories,
    };
  }

  async getMenusByCategoryName(categoryName: string) {
    const category = await this.prisma.category.findFirst({
      where: { name: categoryName },
      include: {
        menus: {
          select: {
            id: true,
            name: true,
            price: true,
            isAvailable: true,
            description: true,
            images: true,
            restaurant: {
              select: {
                name: true,
                rating: true,
                openTime: true,
                closeTime: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return {
      message: 'success',
      count: category.menus.length,
      data: category.menus,
    };
  }

  async create(payload: CreateCategoryDto) {
    const exist = await this.prisma.category.findFirst({
      where: { name: payload.name },
    });

    if (exist) throw new BadRequestException('Category already exists');

    const created = await this.prisma.category.create({
      data: {
        name: payload.name,
        description: payload.description,
      },
    });

    return {
      message: 'success',
      data: created,
    };
  }
}
