import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatasourceModule } from './app/modules/datasource/datasource.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './app/configs/winston/winston.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from './app/configs/throttler/throttler.config';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot({
          isGlobal: true
        }),
        WinstonModule.forRoot(winstonConfig),
        ThrottlerModule.forRoot(throttlerConfig),
        DatasourceModule
    ],
    providers: [
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
      }
    ],
})
export class AppModule {}