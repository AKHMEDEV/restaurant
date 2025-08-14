import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { HelpersModule } from 'src/helpers/helpers.module';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
