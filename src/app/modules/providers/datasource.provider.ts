import { Provider } from "@nestjs/common";
import { datasource } from "src/app/configs/datasource/datasource.config";
import { DATA_SOURCE_KEY } from "src/app/shared/constants/datasource.const";

export const DatasourceProvider: Provider = {
    provide: DATA_SOURCE_KEY,
    useFactory: async () => {
        try {
            if (!datasource.isInitialized) {
                await datasource.initialize();

                console.log('🚀 Database connected successfully');
            }

            return datasource;
        } catch (error) {
            console.error('❌ Error connecting to database:', error.message);
            
            throw error;
        }
    }
}