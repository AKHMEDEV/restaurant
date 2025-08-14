import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { FsHelper } from 'src/helpers';
import { ReactionType } from 'generated/prisma';

@Injectable()
export class RestaurantService {
  constructor(
    private prisma: PrismaService,
    private fsHelper: FsHelper,
  ) {}

  async getAll() {
    const restaurants = await this.prisma.restaurant.findMany({
      include: {
        menus: {
          select: { name: true, price: true, isAvailable: true, views: true },
        },
        orders: true,
        comments: true,
      },
    });

    await Promise.all(
      restaurants.map((restaurant) =>
        this.prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { views: { increment: 1 } },
        }),
      ),
    );

    const restaurantsWithLikes = await Promise.all(
      restaurants.map(async (restaurant) => {
        const likeCount = await this.prisma.reaction.count({
          where: {
            targetId: restaurant.id,
            targetType: 'RESTAURANT',
            type: ReactionType.LIKE,
          },
        });

        return {
          ...restaurant,
          likeCount,
          views: restaurant.views + 1,
        };
      }),
    );

    return {
      message: 'success',
      count: restaurants.length,
      data: restaurantsWithLikes,
    };
  }

  async findOne(restaurantId: string) {
    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { views: { increment: 1 } },
    });

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        menus: true,
        orders: true,
        comments: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const likeCount = await this.prisma.reaction.count({
      where: {
        targetId: restaurantId,
        targetType: 'RESTAURANT',
        type: ReactionType.LIKE,
      },
    });

    return {
      message: 'success',
      data: {
        ...restaurant,
        likeCount,
        views: restaurant.views + 1,
      },
    };
  }

  async create(payload: CreateRestaurantDto, ownerId: string) {
    const existing = await this.prisma.restaurant.findUnique({
      where: { name: payload.name },
    });

    if (existing) throw new BadRequestException('Restaurant already exists, try another name');

    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: payload.name,
        ownerId,
        description: payload.description,
        openTime: payload.openTime,
        closeTime: payload.closeTime,
        locationLatitude: payload.locationLatitude,
        locationLongitude: payload.locationLongitude,
      },
    });

    return {
      message: 'success',
      data: restaurant,
    };
  }

  async update(
    restaurantId: string,
    payload: UpdateRestaurantDto,
    userId: string,
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerId !== userId) throw new UnauthorizedException( 'You do not have permission to update this restaurant');


    if (payload.name && payload.name !== restaurant.name) {
      const existing = await this.prisma.restaurant.findUnique({
        where: { name: payload.name },
      });

      if (existing) throw new BadRequestException('Restaurant name already taken');
    }

    const updated = await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: payload.name,
        description: payload.description,
        openTime: payload.openTime,
        closeTime: payload.closeTime,
        locationLatitude: payload.locationLatitude,
        locationLongitude: payload.locationLongitude,
      },
    });

    return {
      message: 'updated',
      data: updated,
    };
  }

  async delete(restaurantId: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (restaurant.ownerId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to delete this restaurant',
      );
    }

    await this.prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return {
      message: 'deleted',
      data: null,
    };
  }

  async uploadRestaurantImages(
    restaurantId: string,
    files: Express.Multer.File[],
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId.trim() },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const { fileUrl } = await this.fsHelper.uploadFile(file);
      uploadedUrls.push(fileUrl);
    }

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
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
