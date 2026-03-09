import { ValidationPipeOptions } from '@nestjs/common';

export const validationPipeConfig: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: false,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  },
  disableErrorMessages: false,
  stopAtFirstError: false,
};
