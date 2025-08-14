import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateReviewDto } from './dto/create-review.dto';
import { CommentTargetType } from 'generated/prisma';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(authorId: string, dto: CreateReviewDto) {
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!author) throw new BadRequestException('Author not found');

    const data: any = {
      content: dto.content,
      authorId,
      targetType: dto.targetType,
      parentId: dto.parentId || null,
    };

    if (dto.targetType === CommentTargetType.RESTAURANT) {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: dto.targetId },
      });
      if (!restaurant) throw new BadRequestException('Restaurant not found');
      data.targetRestaurantId = dto.targetId;
    } else if (dto.targetType === CommentTargetType.MENU_ITEM) {
      const menu = await this.prisma.menu.findUnique({
        where: { id: dto.targetId },
      });
      if (!menu) throw new BadRequestException('Menu item not found');
      data.targetMenuId = dto.targetId;
    } else {
      throw new BadRequestException('Invalid targetType');
    }

    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) throw new BadRequestException('Parent comment not found');
    }

    const review = await this.prisma.comment.create({ data });

    return {
      message: 'Review created successfully',
      data: review,
    };
  }

  async getByRestaurant(restaurantId: string) {
    const reviews = await this.prisma.comment.findMany({
      where: {
        targetType: CommentTargetType.RESTAURANT,
        targetRestaurantId: restaurantId,
      },
      select: {
        id: true,
        content: true,
        targetType: true,
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        replies: {
          select: {
            id: true,
            content: true,
            authorId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Reviews fetched successfully',
      count: reviews.length,
      data: reviews,
    };
  }
}
