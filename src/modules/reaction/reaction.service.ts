import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentTargetType, ReactionType } from 'generated/prisma';

@Injectable()
export class ReactionService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(
    userId: string,
    targetId: string,
    targetType: CommentTargetType,
  ) {
    // 1️⃣ Target mavjudligini tekshirish
    if (targetType === CommentTargetType.RESTAURANT) {
      const exists = await this.prisma.restaurant.findUnique({
        where: { id: targetId },
      });
      if (!exists) throw new NotFoundException('Restaurant not found');
    } else if (targetType === CommentTargetType.MENU_ITEM) {
      const exists = await this.prisma.menu.findUnique({
        where: { id: targetId },
      });
      if (!exists) throw new NotFoundException('Menu item not found');
    } else {
      throw new NotFoundException('Invalid target type');
    }

    // 2️⃣ Mavjud like’ni topish
    const existing = await this.prisma.reaction.findFirst({
      where: {
        userId,
        targetId,
        targetType,
        type: ReactionType.LIKE,
      },
    });

    // 3️⃣ Agar mavjud bo‘lsa → o‘chirish
    if (existing) {
      await this.prisma.reaction.delete({ where: { id: existing.id } });

      const likeCount = await this.prisma.reaction.count({
        where: { targetId, targetType, type: ReactionType.LIKE },
      });

      return { message: 'Like removed', liked: false, likeCount };
    }

    // 4️⃣ Agar mavjud bo‘lmasa → qo‘shish
    await this.prisma.reaction.create({
      data: { userId, targetId, targetType, type: ReactionType.LIKE },
    });

    const likeCount = await this.prisma.reaction.count({
      where: { targetId, targetType, type: ReactionType.LIKE },
    });

    return { message: 'Like added', liked: true, likeCount };
  }
}
