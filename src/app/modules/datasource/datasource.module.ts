import { Module } from "@nestjs/common";
import { DatasourceProvider } from "../providers/datasource.provider";

@Module({
    imports: [],
    controllers: [],
    providers: [
        DatasourceProvider
    ],
    exports: [
        DatasourceProvider
    ],
})
export class DatasourceModule {};