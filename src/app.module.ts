import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatasourceModule } from './app/modules/datasource/datasource.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './app/configs/winston/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    WinstonModule.forRoot(winstonConfig),
    DatasourceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}