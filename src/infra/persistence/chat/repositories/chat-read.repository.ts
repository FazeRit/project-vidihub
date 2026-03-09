import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatModel } from '../entities/chat.model';
import { ChatEntity } from 'src/domain/chat/entities/chat.entity';
import { ChatMapper } from '../mappers/chat.mapper';
import { IChatRead } from 'src/application/chat/ports/ichat-read.port';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatReadRepository implements IChatRead {
  constructor(
    @InjectRepository(ChatModel)
    private readonly repo: Repository<ChatModel>,
  ) {}

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
    const count = await this.repo.count({
      where: {
        id,
      },
    });

    return count > 0;
  }
}
