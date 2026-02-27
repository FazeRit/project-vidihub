import type { Provider } from '@nestjs/common';
import { datasource } from '../../config/datasource/datasource.config';
import { DATA_SOURCE_KEY } from '../../../shared/constants/datasource.const';

export const DatasourceProvider: Provider = {
  provide: DATA_SOURCE_KEY,
  useFactory: async () => {
    if (!datasource.isInitialized) {
      await datasource.initialize();
      console.log('🚀 Database connected successfully');
    }

    return datasource;
  },
};
