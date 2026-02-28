import { MessageEntity } from 'src/domain/message/entities/message.entity';

export const MESSAGE_READ_REPO = Symbol('message-read');

export abstract class IMessageRead {
  abstract findById(id: string): Promise<MessageEntity | null>;
}
