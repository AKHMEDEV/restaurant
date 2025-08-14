// reaction.controller.ts
import {
  Controller,
  Post,
  Req,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ReactionService } from './reaction.service';
import { ToggleLikeDto } from './dto';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly service: ReactionService) {}

  @Post('toggle-like')
  async toggleLike(@Req() req: Request, @Body() payload: ToggleLikeDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    return this.service.toggleLike(
      userId,
      payload.targetId,
      payload.targetType,
    );
  }
}
