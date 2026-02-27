import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../constants/public.const';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
