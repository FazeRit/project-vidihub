import { MessageEntity } from 'src/domain/chat/entities/message.entity';

export const MESSAGE_WRITE_REPO = Symbol('message-write');

export abstract class IMessageWrite {
  abstract save(chat: MessageEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
