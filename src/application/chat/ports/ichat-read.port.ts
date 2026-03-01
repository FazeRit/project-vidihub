import { ChatEntity } from 'src/domain/chat/entities/chat.entity';

export const CHAT_READ_REPO = Symbol('CHAT_READ_PORT');

export abstract class IChatRead {
  abstract findById(id: string): Promise<ChatEntity | null>;
  abstract findByIdWithMessages(id: string): Promise<ChatEntity | null>;
  abstract exists(id: string): Promise<boolean>;
}
