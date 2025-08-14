

import { Module } from '@nestjs/common';
import { HelpersModule } from 'src/helpers/helpers.module';
import { PrismaModule } from 'src/prisma';
import { CouriersService } from './courer.service';
import { CouriersController } from './courer.controller';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [CouriersController],
  providers: [CouriersService],
})
export class CourerModule {}
