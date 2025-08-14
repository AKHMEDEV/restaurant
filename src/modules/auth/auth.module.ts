import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../prisma';
import { JwtHelper } from '../../helpers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleRateLimitGuard } from './guards/google-rate-limit.guard';
import { GoogleStrategy } from './strategy/google.strategy';
import { MailModule } from 'src/nodemailer/mail.module';

@Module({
  imports: [ConfigModule, JwtModule.register({}), PassportModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtHelper,
    GoogleRateLimitGuard,
    GoogleStrategy,
  ],
})
export class AuthModule {}
