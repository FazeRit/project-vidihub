import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Expose()
export class SelectChatDto {
  @IsUUID()
  chatId: string;
}
