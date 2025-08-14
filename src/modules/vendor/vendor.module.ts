import { Module } from '@nestjs/common';
import { HelpersModule } from 'src/helpers/helpers.module';
import { PrismaModule } from 'src/prisma';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
