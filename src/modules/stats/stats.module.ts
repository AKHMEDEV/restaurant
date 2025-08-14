import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaModule } from 'src/prisma';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [StatsController],
  providers: [StatsService,],
  exports: [StatsService],
})
export class StatsModule {}
