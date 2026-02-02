import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatasourceModule } from './app/modules/datasource/datasource.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatasourceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}