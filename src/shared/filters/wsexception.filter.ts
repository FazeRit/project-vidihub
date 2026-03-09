import {
  Catch,
  ArgumentsHost,
  Inject,
  Logger,
  WsExceptionFilter,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class AllWsExceptionsFilter implements WsExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private readonly redactFields = ['password', 'token', 'authorization'];

  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const data = host.switchToWs().getData();
    const event = host.getArgs()[1]?.event || 'unknown';

    const message = exception instanceof Error ? exception.message : exception;

    this.logger.error({
      stage: 'error',
      type: 'websocket',
      event,
      clientId: client.id,
      message,
      data: this.sanitizeData(data),
      stack:
        process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
    });

    client.emit('error', { status: 'error', message });
  }

  private sanitizeData(data: Record<string, any>): Record<string, any> {
    if (!data) return data;

    return Object.entries(data).reduce((acc, [key, value]) => {
      if (this.redactFields.includes(key.toLowerCase())) {
        acc[key] = '****';
      } else if (typeof value === 'object') {
        acc[key] = this.sanitizeData(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
}
