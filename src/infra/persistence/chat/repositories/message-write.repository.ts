import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE_KEY } from 'src/shared/constants/datasource.const';
import { MessageModel } from '../entities/message.model';
import { IMessageWrite } from 'src/application/chat/ports/imessage-write.port';
import { MessageEntity } from 'src/domain/chat/entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessageWriteRepository implements IMessageWrite {
  private readonly repo: Repository<MessageModel>;

  constructor(
    @Inject(DATA_SOURCE_KEY)
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(MessageModel);
  }

  async save(message: MessageEntity): Promise<void> {
    const messageModel = await MessageMapper.toPersistence(message);

    await this.repo.save(messageModel);
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
