import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurand.controller';
import { FsHelper,  } from 'src/helpers';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [PrismaModule, HelpersModule],
  controllers: [RestaurantController],
  providers: [RestaurantService, FsHelper ],
})
export class RestaurantsModule {}
