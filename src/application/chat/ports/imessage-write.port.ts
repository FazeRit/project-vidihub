import { MessageEntity } from 'src/domain/message/entities/message.entity';

export const MESSAGE_WRITE_REPO = Symbol('message-write');

export abstract class IMessageWrite {
  abstract insert(chat: MessageEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
