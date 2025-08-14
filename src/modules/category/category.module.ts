import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma';
import { HelpersModule } from 'src/helpers/helpers.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [PrismaModule, HelpersModule],
  providers: [CategoryService, PrismaService],
  controllers: [CategoryController],
})
export class categoryModule {}
