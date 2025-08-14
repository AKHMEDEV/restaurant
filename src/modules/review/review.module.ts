import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HelpersModule } from 'src/helpers/helpers.module';
import { ReviewService } from './review.service';
import { ReviewsController } from './review.controller';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [ReviewsController],
  providers: [ReviewService],
})
export class ReviewModule {}
