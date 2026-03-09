import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MessageModel } from '../entities/message.model';
import { IMessageRead } from 'src/application/chat/ports/imessage-read.port';
import { MessageEntity } from 'src/domain/chat/entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageReadRepository implements IMessageRead {
  constructor(
    @InjectRepository(MessageModel)
    private readonly repo: Repository<MessageModel>,
  ) {}

  async findById(id: string): Promise<MessageEntity | null> {
    const message = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!message) return null;

    return MessageMapper.toDomain(message);
  }

  async findByChatId(chatId: string, limit: number): Promise<MessageEntity[]> {
    const messages = await this.repo.find({
      where: {
        chat: {
          id: chatId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });

    return messages.reverse().map((msg) => MessageMapper.toDomain(msg));
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
