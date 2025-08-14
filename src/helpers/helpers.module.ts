import { Module } from '@nestjs/common';
import { JwtHelper } from './jwt.helper';
import { FsHelper } from './fs.helper';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenMiddleware } from './refreshToken.middleware';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtHelper, FsHelper, RefreshTokenMiddleware],
  exports: [JwtHelper, FsHelper, RefreshTokenMiddleware],
})
export class HelpersModule {}
