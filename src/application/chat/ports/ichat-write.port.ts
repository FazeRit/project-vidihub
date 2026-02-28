import { ChatEntity } from 'src/domain/chat/entities/chat.entity';

export const CHAT_WRITE_REPO = Symbol('chat-write');

export abstract class IChatWrite {
  abstract insert(chat: ChatEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
