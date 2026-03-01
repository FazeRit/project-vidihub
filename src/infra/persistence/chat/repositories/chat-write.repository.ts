import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE_KEY } from 'src/shared/constants/datasource.const';
import { ChatModel } from '../entities/chat.model';
import { ChatEntity } from 'src/domain/chat/entities/chat.entity';
import { IChatWrite } from 'src/application/chat/ports/ichat-write.port';
import { ChatMapper } from '../mappers/chat.mapper';

@Injectable()
export class ChatWriteRepository implements IChatWrite {
  private readonly repo: Repository<ChatModel>;

  constructor(
    @Inject(DATA_SOURCE_KEY)
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(ChatModel);
  }

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
