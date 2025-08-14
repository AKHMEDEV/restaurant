import { SetMetadata } from '@nestjs/common';

export const PROTECTED_KEY = 'PROTECTED';

export const Protected = (isProtectced: boolean = false) =>
  SetMetadata(PROTECTED_KEY, isProtectced);
