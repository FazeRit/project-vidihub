import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Expose()
export class DeleteChatDto {
  @IsUUID()
  chatId: string;
}
