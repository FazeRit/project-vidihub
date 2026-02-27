import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { THROTTLER_NAMES } from './const/throttler.const';

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: THROTTLER_NAMES.SHORT,
      ttl: 1000,
      limit: 3,
    },
    {
      name: THROTTLER_NAMES.MEDIUM,
      ttl: 10000,
      limit: 20,
    },
    {
      name: THROTTLER_NAMES.AUTH_LOGIN,
      ttl: 60000,
      limit: 5,
    },
    {
      name: THROTTLER_NAMES.VIDEO_UPLOAD,
      ttl: 60000,
      limit: 200,
    },
  ],
};
