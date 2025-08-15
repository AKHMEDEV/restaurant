import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from 'src/prisma';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
