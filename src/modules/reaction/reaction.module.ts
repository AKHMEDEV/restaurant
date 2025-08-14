import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { HelpersModule } from 'src/helpers/helpers.module';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
