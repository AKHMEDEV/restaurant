import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GOOGLE_RATE_LIMIT_KEY } from '../decorators/google-rate-limit.decorator';

@Injectable()
export class GoogleRateLimitGuard implements CanActivate {
  private requestCounts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const googleRateLimit = this.reflector.get(
      GOOGLE_RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!googleRateLimit) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const ip = request.ip as string;
    const key = `google_oauth:${ip}`;

    const isBlocked = this.checkIfBlocked();

    if (isBlocked) {
      throw new HttpException(
        {
          message:
            "Siz 30 daqiqa bloklangansiz. Google OAuth uchun juda ko'p urinish qildingiz.",
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const now = Date.now();
    const limit = googleRateLimit.limit as number;
    const ttl = googleRateLimit.ttl as number;

    const userRequests = this.requestCounts.get(key);

    if (!userRequests || now > userRequests.resetTime) {
      this.requestCounts.set(key, { count: 1, resetTime: now + ttl });
      return true;
    }

    if (userRequests.count >= limit) {
      this.blockUser(key, googleRateLimit.blockDuration as number);

      throw new HttpException(
        {
          message:
            "Google OAuth uchun juda ko'p urinish qildingiz. 30 daqiqa kuting.",
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    userRequests.count++;
    this.requestCounts.set(key, userRequests);

    return true;
  }

  private checkIfBlocked(): boolean {
    return false;
  }

  private blockUser(key: string, duration: number): void {
    console.log(`User blocked: ${key} for ${duration}ms`);
  }
}
