import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE_KEY } from 'src/shared/constants/datasource.const';
import { ChatModel } from '../entities/chat.model';
import { ChatEntity } from 'src/domain/chat/entities/chat.entity';
import { ChatMapper } from '../mappers/chat.mapper';
import { IChatRead } from 'src/application/chat/ports/ichat-read.port';

@Injectable()
export class ChatReadRepository implements IChatRead {
  private readonly repo: Repository<ChatModel>;

  constructor(
    @Inject(DATA_SOURCE_KEY)
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(ChatModel);
  }

  async findById(id: string): Promise<ChatEntity | null> {
    const chat = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!chat) return null;

    return ChatMapper.toDomain(chat);
  }

  async findByIdWithMessages(id: string): Promise<ChatEntity | null> {
    const chat = await this.repo.findOne({
      where: {
        id,
      },
      relations: ['messages'],
    });

    if (!chat) return null;

    return ChatMapper.toDomain(chat);
  }

  async exists(id: string): Promise<boolean> {
    const chat = await this.repo.findOne({
      where: {
        id,
      },
    });

    return Boolean(chat);
  }
}
