import { SetMetadata } from '@nestjs/common';

export const GOOGLE_RATE_LIMIT_KEY = 'google_rate_limit';

export const GoogleRateLimit = () =>
  SetMetadata(GOOGLE_RATE_LIMIT_KEY, {
    ttl: 60000,
    limit: 5,
    blockDuration: 1800000,
  });
