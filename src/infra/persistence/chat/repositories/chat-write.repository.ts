import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatModel } from '../entities/chat.model';
import { ChatEntity } from 'src/domain/chat/entities/chat.entity';
import { IChatWrite } from 'src/application/chat/ports/ichat-write.port';
import { ChatMapper } from '../mappers/chat.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatWriteRepository implements IChatWrite {
  constructor(
    @InjectRepository(ChatModel)
    private readonly repo: Repository<ChatModel>,
  ) {}

  async save(chat: ChatEntity): Promise<void> {
    const chatModel = await ChatMapper.toPersistence(chat);

    await this.repo.save(chatModel);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async updateLastActivity(id: string): Promise<void> {
    await this.repo.update(id, {
      updatedAt: new Date(),
    });
  }
}
