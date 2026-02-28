import { ChatEntity } from 'src/domain/chat/entities/chat.entity';

export const CHAT_READ_REPO = Symbol('chat-read');

export abstract class IChatRead {
  abstract findById(id: string): Promise<ChatEntity | null>;
}
