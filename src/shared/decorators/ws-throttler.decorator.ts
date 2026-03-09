import { Throttle } from '@nestjs/throttler';
import { THROTTLER_NAMES } from 'src/infra/config/trottler/const/throttler.const';

export const WsThrottle = (name: keyof typeof THROTTLER_NAMES) => {
  const throttlerName = THROTTLER_NAMES[name];

  return Throttle({
    [throttlerName]: {},
  });
};
