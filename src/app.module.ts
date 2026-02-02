import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatasourceModule } from './app/modules/datasource/datasource.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './app/configs/winston/winston.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from './app/configs/throttler/throttler.config';

@Module({
    imports: [
        ConfigModule.forRoot({
          isGlobal: true
        }),
        WinstonModule.forRoot(winstonConfig),
        ThrottlerModule.forRoot(throttlerConfig),
        DatasourceModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}