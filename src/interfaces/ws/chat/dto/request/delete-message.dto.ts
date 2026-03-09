import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class DeleteMessageDto {
  @Expose()
  @IsUUID()
  chatId: string;

  @Expose()
  @IsUUID()
  messageId: string;
}
