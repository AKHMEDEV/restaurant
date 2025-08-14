// reaction.service.ts
import { Injectable } from '@nestjs/common';
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
    const existing = await this.prisma.reaction.findFirst({
      where: {
        userId,
        targetId,
        targetType,
        type: ReactionType.LIKE,
      },
    });

    if (existing) {
      await this.prisma.reaction.delete({ where: { id: existing.id } });

      const likeCount = await this.prisma.reaction.count({
        where: { targetId, targetType, type: ReactionType.LIKE },
      });

      return { message: 'Like removed', liked: false, likeCount };
    }

    await this.prisma.reaction.create({
      data: { userId, targetId, targetType, type: ReactionType.LIKE },
    });

    const likeCount = await this.prisma.reaction.count({
      where: { targetId, targetType, type: ReactionType.LIKE },
    });

    return { message: 'Like added', liked: true, likeCount };
  }
}
