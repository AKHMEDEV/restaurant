import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HelpersModule } from 'src/helpers/helpers.module';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
