import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from 'src/helpers/jwt.helper';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private jwtHelper: JwtHelper) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    if (accessToken) {
      try {
        const decoded = await this.jwtHelper.verifyAccessToken(accessToken);
        req['user'] = decoded;
        return next();
      } catch (err) {
      }
    }

    // Step 2: Refresh token orqali yangilashga harakat qilamiz
    if (refreshToken) {
      try {
        const decodedRefresh = await this.jwtHelper.verifyRefreshToken(refreshToken);

        // Yangi access token yaratamiz
        const newAccessToken = await this.jwtHelper.generateTokens({
          id: decodedRefresh.id,
          role: decodedRefresh.role,
        });

        // Yangi tokenni cookie ga joylaymiz
        res.cookie('accessToken', newAccessToken.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        });

        req['user'] = decodedRefresh;
      } catch (err) {
        (req as any)['user'] = null;
      }
    }

    return next();
  }
}
