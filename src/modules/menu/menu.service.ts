import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateMenuDto, UpdateMenuDto } from './dto';
import { ReactionType } from 'generated/prisma';
import { FsHelper } from 'src/helpers';

@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fsHelper: FsHelper,
  ) {}

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

    const menusWithLikes = await Promise.all(
      menus.map(async (menu) => {
        const likeCount = await this.prisma.reaction.count({
          where: {
            targetId: menu.id,
            targetType: 'MENU_ITEM',
            type: ReactionType.LIKE,
          },
        });

        return {
          ...menu,
          likeCount,
          views: (menu.views || 0) + 1,
        };
      }),
    );

    return {
      message: 'success',
      count: menus.length,
      data: menusWithLikes,
    };
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!menu) throw new NotFoundException('Menu not found');

    await this.prisma.menu.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const likeCount = await this.prisma.reaction.count({
      where: {
        targetId: id,
        targetType: 'MENU_ITEM',
        type: ReactionType.LIKE,
      },
    });

    return {
      message: 'success',
      data: {
        ...menu,
        likeCount,
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

  async uploadMenuImages(menuId: string, files: Express.Multer.File[]) {
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId.trim() },
    });

    if (!menu) throw new NotFoundException('Menu not found');

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const { fileUrl } = await this.fsHelper.uploadFile(file);
      uploadedUrls.push(fileUrl);
    }

    await this.prisma.menu.update({
      where: { id: menuId },
      data: {
        images: {
          push: uploadedUrls,
        },
      },
    });

    return {
      message: 'success',
      images: uploadedUrls,
    };
  }
}
