import { MessageEntity } from 'src/domain/chat/entities/message.entity';

export const MESSAGE_READ_REPO = Symbol('message-read');

export abstract class IMessageRead {
  abstract findById(id: string): Promise<MessageEntity | null>;
  abstract exists(id: string): Promise<boolean>;
  abstract findByChatId(
    chatId: string,
    limit: number,
  ): Promise<Array<MessageEntity | null>>;
}
