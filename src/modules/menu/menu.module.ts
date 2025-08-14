import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
