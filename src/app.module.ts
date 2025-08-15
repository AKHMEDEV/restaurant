import { join } from 'path';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RestaurantsModule } from './modules/restaurant/restaurant.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RefreshTokenMiddleware } from './helpers/refreshToken.middleware';
import { HelpersModule } from './helpers/helpers.module';
import { MenuModule } from './modules/menu/menu.module';
import { categoryModule } from './modules/category/category.module';
import { AdminModule } from './modules/admin/admin.modules';
import { VendorModule } from './modules/vendor/vendor.module';
import { CourerModule } from './modules/courer/courer.module';
import { ReviewModule } from './modules/review/review.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { OrdersModule } from './modules/order/order.module';
import { StatsModule } from './modules/stats/stats.module';
import { CartModule } from './modules/cart';
import { FavoriteModule } from './modules/favorites';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'images'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    AdminModule,
    VendorModule,
    RestaurantsModule,
    OrdersModule,
    MenuModule,
    CourerModule,
    HelpersModule,
    ReviewModule,
    FavoriteModule, 
    CartModule,
    ReactionModule,
    categoryModule,
    StatsModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*');
  }
}
