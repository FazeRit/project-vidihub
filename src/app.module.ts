import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './infra/config/logger/winston.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from './infra/config/trottler/throttler.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from './infra/config/datasource/datasource.config';
import { ChatModule } from './modules/chat/chat.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllWsExceptionsFilter } from './shared/filters/wsexception.filter';
import { WsLoggerInterceptor } from './shared/interceptors/ws-request-logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    TypeOrmModule.forRoot({
      ...datasource.options,
      autoLoadEntities: true,
      entities: [],
      migrations: [],
    }),
    ChatModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: WsLoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllWsExceptionsFilter,
    },
  ],
})
export class AppModule {}
