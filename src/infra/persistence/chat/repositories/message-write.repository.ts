import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MessageModel } from '../entities/message.model';
import { IMessageWrite } from 'src/application/chat/ports/imessage-write.port';
import { MessageEntity } from 'src/domain/chat/entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageWriteRepository implements IMessageWrite {
  constructor(
    @InjectRepository(MessageModel)
    private readonly repo: Repository<MessageModel>,
  ) {}

  async save(message: MessageEntity): Promise<void> {
    const messageModel = await MessageMapper.toPersistence(message);

    await this.repo.save(messageModel);
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
