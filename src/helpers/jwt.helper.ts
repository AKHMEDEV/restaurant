import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { UserRole } from 'generated/prisma';

@Injectable()
export class JwtHelper {
  constructor(private jwt: JwtService) {}

  async generateTokens(payload: { id: string; role: UserRole }) {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: Number(process.env.ACCESS_TOKEN_TIME) || 900,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_TIME || '7d',
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string) {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Access token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Access token formati notogri');
      }
      throw new InternalServerErrorException('Token tekshirishda xatolik');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Refresh token muddati tugagan');
      }
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Refresh token formati notogri');
      }
      throw new InternalServerErrorException('Token tekshirishda xatolik');
    }
  }

  async generateResetToken(payload: { id: string }) {
    return await this.jwt.signAsync(payload, {
      secret: process.env.RESET_TOKEN_SECRET,
      expiresIn: Number(process.env.RESET_TOKEN_TIME) || 900,
    });
  }

  async verifyResetToken(token: string) {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: process.env.RESET_TOKEN_SECRET,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Reset token muddati tugagan');
      }
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Reset token yaroqsiz');
      }
      throw new InternalServerErrorException('Reset token tekshirishda xatolik',
      );
    }
  }
}
