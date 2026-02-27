import { Global, Module } from '@nestjs/common';
import { DatasourceProvider } from './providers/datasource.provider';

@Global()
@Module({
  imports: [],
  providers: [DatasourceProvider],
  exports: [DatasourceProvider],
})
export class DatasourceModule {}
