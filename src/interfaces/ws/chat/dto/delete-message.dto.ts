import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Expose()
export class DeleteMessageDto {
  @IsUUID()
  chatId: string;

  @IsUUID()
  messageId: string;
}
