import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class DeleteChatDto {
  @Expose()
  @IsUUID()
  chatId: string;
}
