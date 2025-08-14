import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtHelper } from 'src/helpers/jwt.helper';
import { UserRole } from 'generated/prisma';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.cookies?.['accessToken'];

    if (!accessToken) {
      throw new UnauthorizedException('Access token topilmadi');
    }

    try {
      const decoded: { id: string; role: UserRole } =
        await this.jwtHelper.verifyAccessToken(accessToken);

      request.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati tugagan');
    }
  }
}
