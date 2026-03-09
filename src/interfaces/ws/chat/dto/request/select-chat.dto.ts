import { Expose } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

export class SelectChatDto {
  @Expose()
  @IsUUID()
  chatId: string;

  @Expose()
  @IsNumber()
  limit: number = 50;
}
