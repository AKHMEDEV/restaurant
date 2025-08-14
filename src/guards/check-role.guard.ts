import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'generated/prisma';
import { ROLES_KEY } from 'src/decorators';
import { JwtHelper } from 'src/helpers';

@Injectable()
export class CheckRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.cookies?.accessToken;

    if (!accessToken) {
      throw new UnauthorizedException('pleace login token not found your ccokie');
    }

    try {
      const decoded = await this.jwtHelper.verifyAccessToken(accessToken);

      if (!requiredRoles.includes(decoded.role)) {
        throw new ForbiddenException('dont have permission');
      }

      request.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return true;
    } catch (error) {
      console.error('Token verify error:', error);
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Token is invalid or expired.');
    }
  }
}
