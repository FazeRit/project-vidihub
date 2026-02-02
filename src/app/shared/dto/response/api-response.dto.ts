import { HttpStatus } from "@nestjs/common";
import { Expose } from "class-transformer";

@Expose()
export class ApiResponseDto<TData, TMeta extends object> {
    data: TData;
    message: string;
    statusCode: number;
    meta?: TMeta;

    constructor(dto: {
        data: TData;
        message?: string;
        statusCode?: HttpStatus;
        meta?: TMeta;
    }) {
        const {
            data,
            message = 'Success',
            statusCode = 200,
            meta
        } = dto;

        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.meta = meta;
    }
}