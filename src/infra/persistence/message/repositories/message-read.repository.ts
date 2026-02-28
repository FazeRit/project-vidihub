import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE_KEY } from 'src/shared/constants/datasource.const';
import { MessageModel } from '../entities/message.model';
import { IMessageRead } from 'src/application/chat/ports/imessage-read.port';
import { MessageEntity } from 'src/domain/message/entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessageReadRepository implements IMessageRead {
  private readonly repo: Repository<MessageModel>;

  constructor(
    @Inject(DATA_SOURCE_KEY)
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(MessageModel);
  }

  async findById(id: string): Promise<MessageEntity | null> {
    const message = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!message) return null;

    return MessageMapper.toDomain(message);
  }
}
