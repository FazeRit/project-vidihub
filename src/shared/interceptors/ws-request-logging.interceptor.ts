import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WsLoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private readonly redactFields = ['password', 'token', 'authorization'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'ws') return next.handle();

    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    const event = context.getHandler().name;

    const requestId = uuidv4();
    const startTime = process.hrtime();

    const safeData = this.sanitizeData(data);

    this.logger.info({
      requestId,
      stage: 'ws-start',
      event,
      clientId: client.id,
      data: safeData,
    });

    return next.handle().pipe(
      tap({
        next: (val) => {
          this.logger.info({
            requestId,
            stage: 'ws-end',
            event,
            duration: `${this.calculateDuration(startTime)} ms`,
            response: this.sanitizeData(val),
          });
        },
        error: (err) => {
          this.logger.error({
            requestId,
            stage: 'ws-error',
            event,
            duration: `${this.calculateDuration(startTime)} ms`,
            error: err.message,
          });
        },
      }),
    );
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    return Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (this.redactFields.includes(key.toLowerCase())) {
          acc[key] = '****';
        } else if (Array.isArray(value)) {
          acc[key] = value.map((v) => this.sanitizeData(v));
        } else if (typeof value === 'object') {
          acc[key] = this.sanitizeData(value);
        } else {
          acc[key] = value;
        }
        return acc;
      },
      (Array.isArray(data) ? [] : {}) as any,
    );
  }

  private calculateDuration(startHrTime: [number, number]): string {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(startHrTime);
    const durationMs = (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
    return durationMs.toFixed(2);
  }
}
