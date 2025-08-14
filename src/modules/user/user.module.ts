import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma';
import { UserController } from './user.controller';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [PrismaModule,  HelpersModule],
  providers: [UserService, PrismaService, ],
  controllers:[UserController]
})
export class UserModule {}
