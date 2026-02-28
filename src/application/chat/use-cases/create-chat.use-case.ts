import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CHAT_WRITE_REPO, IChatWrite } from '../ports/ichat-write.port';
import { ChatEntity } from 'src/domain/chat/entities/chat.entity';

@Injectable()
export class CreateChatUseCase {
  constructor(
    @Inject(CHAT_WRITE_REPO)
    private readonly repo: IChatWrite,
  ) {}

  async execute(title: string, description?: string): Promise<ChatEntity> {
    const id = uuidv4();

    const chat = ChatEntity.create(id, title, description);

    await this.repo.insert(chat);

    return chat;
  }
}
